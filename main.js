class User {
<<<<<<< HEAD
    constructor(username, password) {
        this.username = username,
            this.password = password
    }

    function createUser() {
=======
    constructor(username, password){
        this.username = username;
        this.password = password;
    }

    function createUser(){
>>>>>>> c5a149c933a3313f09cb5f6c52943114284b43c4
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

<<<<<<< HEAD
    function getAllNotes() {

    }

    function getNotesByTag() {

    }

    function createNewNote() {

    }

    function updateNote() {

    }

    function deleteNote() {

=======
    function getAllNotes(){
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

    function getNotesByTag(){
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

    function createNewNote(){
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

    function updateNote(text, title, tags){
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

    function deleteNote(text, title, tags){
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
>>>>>>> c5a149c933a3313f09cb5f6c52943114284b43c4
    }

}