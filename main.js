class User {
    constructor(username, password){
        this.username = username;
        this.password = password;
        this.auth = 'Basic ' + btoa(username + ':' + password);
    }

    createUser(){
        const creationEndpoint = 'https://notes-api.glitch.me/api/users'
        fetch(creationEndpoint, {
            method: 'POST',
            body: JSON.stringify({ 'username': this.username, 'password': this.password}),
            headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(function (response){
                if (response.status == 422){
                    return 'Welcome Back!'
                } else if (response.status == 201){
                    return 'New user successfully created!'
                }
        })
    }

    getAllNotes(){
        const allNotesEndpoint = "https://notes-api.glitch.me/api/notes"
        fetch(allNotesEndpoint, {
            method: 'GET',
            headers:  {
                'Authorization': this.auth
            }
         })
         .then(function (response){
            return response.json();
        })
    }

    getNotesByTag(tag){
        let notesByTagEndpoint = "https://notes-api.glitch.me/api/notes/tagged/" + tag;
        fetch(notesByTagEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': this.auth
             }
        })
        .then(function (response){
            console.log(response.status);
        })
    }

    createNewNote(text, title, tags){
        const newNoteEndpoint = "https://notes-api.glitch.me/api/notes"
        fetch(newNoteEndpoint, {
            method: 'POST',
            body: JSON.stringify({ 'text': text, 'title': title, 'tags': tags}),
            headers: {
                'Authorization': this.auth,
                'Content-Type': 'application/json'
            }
         })
        .then(function (response){
            console.log(response.status);
        })
    }

    updateNote(text, title, tags, noteId){
        let updateNoteEndpoint = "https://notes-api.glitch.me/api/notes/" + noteId;
        fetch(updateNoteEndpoint, {
            method: 'PUT',
            body: JSON.stringify({ 'text': text, 'title': title, 'tags': tags}),
            headers: {
                'Authorization': this.auth,
                'Content-Type': 'application/json'
            }
        })
        .then(function (response){
            console.log(response.status);
        })
    }

    deleteNote(noteId){
        let deleteNoteEndpoint = "https://notes-api.glitch.me/api/notes/" + noteId;
        fetch(deleteNoteEndpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': this.auth
            }
        })
        .then(function (response){
            console.log(response.status);
        })
    }
}

class app {
    constructor(user){
        this.user = user;
        this.loggedIn = false;
    }

    renderPage(){
        if (this.loggedIn == false){
            //show loggin page
        } else {
            //show users main page
        }
    }

    loginOrCreateUser(){
        //login or create user
    }

    populateNotes(){
        // get all notes and render on page
    }

    populateNotesByTag(){
        // get all notes with a certain tag and populate them
    }

    getCreateNewNoteData(){
        // get create new note data from form
    }

    getDeleteNoteData(){
        // get delete note data from form
    }

    getUpdateNoteData(){
        // get update note data from form
    }
}

user = new User('james', 'matt');
user.getAllNotes();