class User {
    constructor(username, password) {
        this.username = username,
            this.password = password
    }

    function createUser() {
        const creationEndpoint = 'https://notes-api.glitch.me/api/users'
        fetch('https://notes-api.glitch.me/api/users', {
            method = 'POST',
            headers = new Headers({
                'username': this.username,
                'password': this.password
            })
        })
    }

    function getAllNotes() {

    }

    function getNotesByTag() {

    }

    function createNewNote() {

    }

    function updateNote() {

    }

    function deleteNote() {

    }

}