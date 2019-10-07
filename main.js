class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.auth = 'Basic ' + btoa(username + ':' + password);
    }

    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.password;
    }

    getAuth() {
        return this.auth;
    }
}

class App {
    constructor() {
        this.user = '';
        this.data = {};
        this.selectedNote = '';
        this.newUser = false;
        this.loggedIn = false;
    }

    getSortedNotesOrder(){
        let unsortedDates = [];
        let tmp = [];
        let sortedOrder = [];

        for (let i = 0; i < this.data.notes.length; i++){
            unsortedDates[i] = new Date(this.data.notes[i].updated).getTime();
        }

        tmp = unsortedDates.slice();

        tmp.sort(function (a, b){
            if (a > b){
                return -1
            } else if (b > a){
                return 1
            } else {
                return 0
            }
        });

        for (let i = 0; i < tmp.length; i++){
            for (let j = 0; j < unsortedDates.length; j++){
                if (tmp[i] == unsortedDates[j]){
                    sortedOrder.push(j);
                }
            }
        }

        return sortedOrder;
    }

    renderPage(notes) {
        this.removeNoteChildren();
        this.removeLabelAndInputChildren();
        this.addActionButtonsAndInput();
        let parent = document.getElementById('notes');
        let ulChild = document.createElement('ul');
        let sorted = this.getSortedNotesOrder();
        ulChild.classList.add('list')
        ulChild.setAttribute('id', 'list');
        let self = this;
        for (let i = 0; i < Object.keys(notes.notes).length; i++) {
            let child = document.createElement('li');
            child.classList.add('note');
            child.addEventListener("click", function() {
                let clickedNotes = document.querySelectorAll('.note')
                for (let i = 0; i < clickedNotes.length; i++) {
                    clickedNotes[i].style.color = 'black';
                }
                if (self.selectedNote == notes.notes[i]._id){
                    child.style.color = 'black';
                    self.selectedNote = '';
                } else {
                    child.style.color = 'blue';
                    self.selectedNote = notes.notes[i]._id
                }
                event.preventDefault();
            })
            if (notes.notes[sorted[i]].title == '' || notes.notes[sorted[i]].title == null){
                if (notes.notes[sorted[i]].updated == '' || notes.notes[sorted[i]].updated == null){
                    if (notes.notes[sorted[i]].tags != null && notes.notes[sorted[i]].tags[0].length > 0){
                        let tagsText = notes.notes[sorted[i]].tags.join();
                        child.innerHTML = '<span> ' + notes.notes[sorted[i]].text + ' Tags: ' + tagsText + ' <span>';
                    } else {
                        child.innerHTML = '<span> ' + notes.notes[sorted[i]].text + ' <span>';
                    }
                } else {
                    if (notes.notes[sorted[i]].tags != null && notes.notes[sorted[i]].tags[0].length > 0){
                        let tagsText = notes.notes[sorted[i]].tags.join();
                        let date = new Date(notes.notes[sorted[i]].updated);
                        child.innerHTML = '<span> ' + notes.notes[sorted[i]].text + '<em>' + ' Updated: '+ date.toString() + '</em>' + ' Tags: ' + tagsText + ' <span>';
                    } else {
                        let date = new Date(notes.notes[sorted[i]].updated);
                        child.innerHTML = '<span> ' + notes.notes[sorted[i]].text + '<em>' + ' Updated: '+ date.toString() + '</em>' + ' <span>';
                    }
                }
            } else {
                if (notes.notes[sorted[i]].updated == '' || notes.notes[sorted[i]].updated == null) {
                    if (notes.notes[sorted[i]].tags != null && notes.notes[sorted[i]].tags[0].length > 0){
                        let tagsText = notes.notes[sorted[i]].tags.join();
                        child.innerHTML = '<span> ' + '<strong>' + notes.notes[sorted[i]].title + ': ' + '</strong>' + notes.notes[sorted[i]].text + ' Tags: ' + tagsText + ' <span>';
                    } else {
                        child.innerHTML = '<span> ' + '<strong>' + notes.notes[sorted[i]].title + ': ' + '</strong>' + notes.notes[sorted[i]].text + ' <span>';
                    }
                } else {
                    if (notes.notes[sorted[i]].tags != null && notes.notes[sorted[i]].tags[0].length > 0){
                        let tagsText = notes.notes[sorted[i]].tags.join();
                        let date = new Date(notes.notes[sorted[i]].updated);
                        child.innerHTML = '<span> ' + '<strong>' + notes.notes[sorted[i]].title + ': ' + '</strong>' + notes.notes[sorted[i]].text + '<em>' + ' Updated: '+ date.toString() + '</em>' + ' Tags: ' + tagsText + ' <span>';
                    } else {
                        let date = new Date(notes.notes[sorted[i]].updated);
                        child.innerHTML = '<span> ' + '<strong>' + notes.notes[sorted[i]].title + ': ' + '</strong>' + notes.notes[sorted[i]].text + '<em>' + ' Updated: '+ date.toString() + '</em>' + ' <span>';
                    }
                }
            }
            ulChild.appendChild(child);
        }
        parent.appendChild(ulChild);
    }

    loginOrCreateUser(user) {
        this.user = user;
        const creationEndpoint = 'https://notes-api.glitch.me/api/users'
        let self = this;
        fetch(creationEndpoint, {
                method: 'POST',
                body: JSON.stringify({ 'username': user.getUsername(), 'password': user.getPassword() }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                return response.status;
            })
            .then(function(status) {
                if (status == 422) {
                    self.loggedIn = true;
                    self.hideLoginForm();
                    self.createAndAppendWelcomeChild('Welcome Back!');
                    self.populateNotes();
                } else if (status == 201) {
                    self.loggedIn = true;
                    self.newUser = true;
                    self.hideLoginForm();
                    self.createAndAppendWelcomeChild('New User Created');
                    self.populateNotes();
                } else {
                    self.revealInvalidLogin();
                    self.createAndAppendInvalidLoginChild('Invalid login, please try again.')
                }
            })
        }

    populateNotes() {
        const allNotesEndpoint = "https://notes-api.glitch.me/api/notes"
        let self = this;
        fetch(allNotesEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': this.user.getAuth()
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                self.data = data;
                self.renderPage(data);
            })
    }

    populateNotesByTag(tag) {
        const notesByTagEndpoint = "https://notes-api.glitch.me/api/notes/tagged/";
        let self = this;
        fetch(notesByTagEndpoint + tag, {
                method: 'GET',
                headers: {
                    'Authorization': this.user.getAuth()
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                self.data = data;
                self.renderPage(data);
            })
    }

    createNewNote(text, title, tags) {
        const newNoteEndpoint = "https://notes-api.glitch.me/api/notes"
        let self = this;
        fetch(newNoteEndpoint, {
                method: 'POST',
                body: JSON.stringify({ 'text': text, 'title': title, 'tags': tags }),
                headers: {
                    'Authorization': this.user.getAuth(),
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                self.populateNotes();
            })
    }

    deleteNote() {
        const deleteNoteEndpoint = "https://notes-api.glitch.me/api/notes/";
        let self = this;
        fetch(deleteNoteEndpoint + self.selectedNote, {
                method: 'DELETE',
                headers: {
                    'Authorization': this.user.getAuth(),
                }
            })
            .then(function(response) {
                self.populateNotes();
            })
    }

    updateNote(text, title, tags) {
        const updateNoteEndpoint = "https://notes-api.glitch.me/api/notes/";
        let self = this;
        fetch(updateNoteEndpoint + self.selectedNote, {
                method: 'PUT',
                body: JSON.stringify({ 'text': text, 'title': title, 'tags': tags }),
                headers: {
                    'Authorization': this.user.getAuth(),
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                self.populateNotes();
            })
    }

    createAndAppendWelcomeChild(message) {
        let child = document.createElement('p');
        let parent = document.getElementById('notes');
        child.innerHTML = '<span> ' + message + ' <span>';
        child.classList.add('welcome');
        parent.appendChild(child);
    }

    removeWelcomeChild(){
        let child = document.querySelector('.welcome');
        child.parentElement.removeChild(child);
    }

    createAndAppendInvalidLoginChild(message) {
        let child = document.createElement('p');
        let parent = document.getElementById('invalid-login');
        child.innerHTML = '<span> ' + message + ' <span>';
        child.classList.add('error');
        parent.appendChild(child);
    }

    addActionButtonsAndInput() {
        let self = this;
        let buttParent = document.getElementById('buttons');
        let inputParent = document.getElementById('input');

        let titleLabel = document.createElement('p');
        titleLabel.innerHTML = 'Title:';
        titleLabel.classList.add('label');
        let title = document.createElement('INPUT');
        title.classList.add('input');
        title.setAttribute('id', 'title-field');
        title.setAttribute('type', 'text');

        let noteTextLabel = document.createElement('p');
        noteTextLabel.innerHTML = 'Text:';
        noteTextLabel.classList.add('label');
        let noteText = document.createElement('textarea');
        noteText.classList.add('input');
        noteText.setAttribute('id', 'note-text-field');
        noteText.setAttribute('type', 'text');

        let noteTagsLabel = document.createElement('p');
        noteTagsLabel.innerHTML = 'Tags:';
        noteTagsLabel.classList.add('label');
        let noteTags = document.createElement('INPUT');
        noteTags.classList.add('input');
        noteTags.setAttribute('id', 'note-tags-field');
        noteTags.setAttribute('type', 'text');


        inputParent.appendChild(titleLabel);
        inputParent.appendChild(title);
        inputParent.appendChild(noteTextLabel);
        inputParent.appendChild(noteText);
        inputParent.appendChild(noteTagsLabel);
        inputParent.appendChild(noteTags);

        let addButt = document.createElement('button');
        addButt.classList.add('butt');
        addButt.addEventListener("click", function() {
            let titleVal = title.value;
            let textVal = noteText.value;
            let tagsVal = noteTags.value.split(",");
            self.createNewNote(textVal, titleVal, tagsVal)
            event.preventDefault()
        });
        addButt.innerHTML = 'add Note';
        let upButt = document.createElement('button');
        upButt.classList.add('butt');
        upButt.addEventListener("click", function() {
            let titleVal = title.value;
            let textVal = noteText.value;
            let tagsVal = noteTags.value.split(",")
            self.updateNote(textVal, titleVal, tagsVal)
            event.preventDefault()
        });
        upButt.innerHTML = 'update Note';
        let delButt = document.createElement('button');
        delButt.classList.add('butt');
        delButt.addEventListener('click', function() {
            self.deleteNote();
            event.preventDefault()
        });
        delButt.innerHTML = 'delete Note';
        let tagButt = document.createElement('button');
        tagButt.classList.add('butt');
        tagButt.addEventListener('click', function() {
            let tagsVal = noteTags.value;
            self.populateNotesByTag(tagsVal);
            event.preventDefault()
        });
        tagButt.innerHTML = 'get Notes by Tag';
        let allButt = document.createElement('button');
        allButt.classList.add('butt');
        allButt.addEventListener('click', function() {
            self.populateNotes();
            event.preventDefault()
        });
        allButt.innerHTML = 'get all Notes';
        let logButt = document.createElement('button');
        logButt.classList.add('butt');
        logButt.addEventListener('click', function() {
            self.removeNoteChildren();
            self.removeLabelAndInputChildren();
            self.removeWelcomeChild();
            self.revealLoginForm();
            event.preventDefault()
        });
        logButt.innerHTML = 'Logout';
        buttParent.appendChild(addButt);
        buttParent.appendChild(upButt);
        buttParent.appendChild(delButt);
        buttParent.appendChild(tagButt);
        buttParent.appendChild(allButt);
        buttParent.appendChild(logButt);
    }

    removeNoteChildren() {
        let parent = document.getElementById('list')
        if (parent != null) {
            parent.parentElement.removeChild(parent);
        }
    }

    removeLabelAndInputChildren() {
        let inputs = document.querySelectorAll('.input');
        let parent = document.getElementById('input');
        for (let i = 0; i < inputs.length; i++) {
            parent.removeChild(inputs[i]);
        }
        let labels = document.querySelectorAll('.label');
        for (let i = 0; i < labels.length; i++) {
            parent.removeChild(labels[i]);
        }
        let buttons = document.querySelectorAll('.butt');
        let buttParent = document.getElementById('buttons');
        for (let i = 0; i < buttons.length; i++) {
            buttParent.removeChild(buttons[i]);
        }
    }

    hideInvalidLogin() {
        document.getElementById('invalid-login').classList.add('hidden');
    }

    revealInvalidLogin() {
        document.getElementById('invalid-login').classList.add('hidden');
    }

    hideLoginForm() {
        document.getElementById('login-form').classList.add('hidden');
    }

    revealLoginForm() {
        let username = document.getElementById('username');
        let password = document.getElementById('password');
        username.value = '';
        password.value = '';
        document.getElementById('login-form').classList.remove('hidden');
    }

}

main();

function main(){
    let app = new App();
    let login = document.getElementById('subButt')
    login.addEventListener('click', function() {
        let username = document.getElementById('username');
        let password = document.getElementById('password');
        let user = new User(username.value, password.value);
        app.loginOrCreateUser(user)
        event.preventDefault();
        })
    }