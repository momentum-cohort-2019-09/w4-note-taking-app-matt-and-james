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
        this.user = "";
        this.data = {};
        this.selectedNote = '';
        this.newUser = false;
        this.loggedIn = false;
    }

    renderInitLogin() {
        let self = this
        if (this.loggedIn == false) {
            this.revealLoginForm();

            let login = document.getElementById('subButt')
            login.addEventListener('click', function() {
                let username = document.getElementById('username')
                let password = document.getElementById('password')
                this.user = new User(username.value, password.value)
                self.loginOrCreateUser()
            })

        } else if (this.loggedIn == true && this.newUser == false) {
            this.hideLoginForm();
            this.createAndAppendWelcomeChild('Welcome Back!');
        } else if (this.loggedIn == true && this.newUser == true) {
            this.hideLoginForm();
            this.createAndAppendWelcomeChild('New user created!')
        }
    }

    renderPage(notes) {
        this.removeNoteChildren();
        this.removeLabelAndInputChildren();
        this.addActionButtonsAndInput();
        let parent = document.getElementById('notes');
        let ulChild = document.createElement('ul');
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
                child.style.color = 'blue';
                self.selectedNote = notes.notes[i]._id
                event.preventDefault();
            })
            child.innerHTML = '<span> ' + notes.notes[i].text + ' <span>';
            ulChild.appendChild(child);
        }
        parent.appendChild(ulChild);
    }

    // works
    loginOrCreateUser() {
        const creationEndpoint = 'https://notes-api.glitch.me/api/users'
        let self = this;
        console.log(this.user)
        fetch(creationEndpoint, {
                method: 'POST',
                body: JSON.stringify({ 'username': self.user.getUsername(), 'password': self.user.getPassword() }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                return response.status;
            })
            .then(function(status) {
                console.log(status)
                if (status == 422) {
                    self.loggedIn = true;
                    self.renderInitLogin();
                } else if (status == 201) {
                    self.loggedIn = true;
                    self.newUser = true;
                    self.renderInitLogin();
                } else {
                    self.revealInvalidLogin();
                    self.createAndAppendInvalidLoginChild('Invalid login, please try again.')
                }
            })
    }

    // works
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

    // works
    populateNotesByTag(tag) {
        let notesByTagEndpoint = "https://notes-api.glitch.me/api/notes/tagged/" + tag;
        let self = this;
        fetch(notesByTagEndpoint, {
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

    // works
    createNewNote(text, title, tags) {
        const newNoteEndpoint = "https://notes-api.glitch.me/api/notes"
        this.self = this;
        fetch(newNoteEndpoint, {
                method: 'POST',
                body: JSON.stringify({ 'text': text, 'title': title, 'tags': tags }),
                headers: {
                    'Authorization': this.user.getAuth(),
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                //
            })
    }

    // works
    deleteNote() {
        let deleteNoteEndpoint = "https://notes-api.glitch.me/api/notes/" + this.selectedNote;
        let self = this;
        fetch(deleteNoteEndpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization': this.user.getAuth(),
                }
            })
            .then(function(response) {
                self.populateNotes();
            })
    }

    // works
    updateNote(text, title, tags) {
        let updateNoteEndpoint = "https://notes-api.glitch.me/api/notes/" + this.selectedNote;
        let self = this;
        fetch(updateNoteEndpoint, {
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

    // works
    createAndAppendWelcomeChild(message) {
        let child = document.createElement('p');
        let parent = document.getElementById('notes');
        child.innerHTML = '<span> ' + message + ' <span>';
        child.classList.add('welcome');
        parent.appendChild(child);
    }

    // works
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
            let tagsVal = noteTags.value;
            if (tagsVal == "" || titleVal == "") {
                self.createNewNote(textVal)
                self.populateNotes()
            } else {
                self.createNewNote(textVal, titleVal, tagsVal)
                self.populateNotes()
            }
            event.preventDefault()
        });
        addButt.innerHTML = 'add Note';
        let upButt = document.createElement('button');
        upButt.classList.add('butt');
        upButt.addEventListener("click", function() {
            let titleVal = title.value;
            let textVal = noteText.value;
            let tagsVal = noteTags.value;
            if (tagsVal == "" || titleVal == "") {
                self.updateNote(textVal)
                self.populateNotes()
            } else {
                self.updateNote(textVal, titleVal, tagsVal)
                self.populateNotes()
            }
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
        buttParent.appendChild(addButt);
        buttParent.appendChild(upButt);
        buttParent.appendChild(delButt);
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
        document.getElementById('login-form').classList.remove('hidden');
    }
}

let app = new App();
app.renderInitLogin();