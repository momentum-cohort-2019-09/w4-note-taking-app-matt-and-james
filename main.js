import { createSecureServer } from "http2";
import { createServer } from "https";

class User(){
    constructor(username, password){
        this.username = username;
        this.password = password;
    }

    function createServer(){
        const creationEndpoint = 'https://notes-api.glitch.me/api/users'
        fetch('https://notes-api.glitch.me/api/users'), {
            method = 'POST',
            headers = new Headers({
                'username': this.username,
                'password': this.password
            })
        }
    }
}

class Note(){

}

