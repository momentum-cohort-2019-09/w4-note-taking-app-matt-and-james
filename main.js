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
                console.log(response.status);
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
            console.log(response.status);
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

user = new User('james', 'matt');
user.getAllNotes();

