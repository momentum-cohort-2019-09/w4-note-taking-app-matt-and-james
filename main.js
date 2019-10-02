class User {
    constructor(username, password){
        this.username = username;
        this.password = password;
    }

    createUser(){
        const creationEndpoint = 'https://notes-api.glitch.me/api/users'
        fetch(creationEndpoint, {
            method = 'POST',
            headers = new Headers({
                'username': this.username,
                'password': this.password
            })
            .then(function (response){
                console.log(response.status);
            })
        })
    }

    getAllNotes(){
        const allNotesEndpoint = "https://notes-api.glitch.me/api/notes"
        fetch(creationEndpoint, {
            method = 'GET',
            headers = new Headers({
                'username': this.username,
                'password': this.password
            })
            .then(function (response){
                console.log(response.status);
            })
        })
    }

    getNotesByTag(){
        const notesByTagEndpoint = "https://notes-api.glitch.me/api/notes/tagged/:tag"
        fetch(notesByTagEndpoint, {
            method = 'GET',
            headers = new Headers({
                'username': this.username,
                'password': this.password
            })
            .then(function (response){
                console.log(response.status);
            })
        })
    }

    createNewNote(){
        const newNoteEndpoint = "https://notes-api.glitch.me/api/notes"
        fetch(newNoteEndpoint, {
            method = 'POST',
            headers = new Headers({
                'username': this.username,
                'password': this.password
            })
            .then(function (response){
                console.log(response.status);
            })
        })
    }

    updateNote(text, title, tags){
        const updateNoteEndpoint = "https://notes-api.glitch.me/api/notes/:id"
        fetch(updateNoteEndpoint, {
            method = 'PUT',
            headers = new Headers({
                'username': this.username,
                'password': this.password
            })
            .then(function (response){
                console.log(response.status);
            })
        })
    }

    deleteNote(text, title, tags){
        const deleteNoteEndpoint = "https://notes-api.glitch.me/api/notes/:id"
        fetch(deleteNoteEndpoint, {
            method = 'DELETE',
            headers = new Headers({
                'username': this.username,
                'password': this.password
            })
            .then(function (response){
                console.log(response.status);
            })
        })
    }
}

