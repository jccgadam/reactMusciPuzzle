import app from 'firebase/app';

let firebaseConfig = {
    apiKey: "AIzaSyAMS8cZMImRfPKgFTDpf2hoS9QF3gTKr30",
    authDomain: "musicpuzzle-28e08.firebaseapp.com",
    projectId: "musicpuzzle-28e08",
    storageBucket: "musicpuzzle-28e08.appspot.com",
    messagingSenderId: "603345026407",
    appId: "1:603345026407:web:b611fd5d5ac2b8a6f0c3c2",
    measurementId: "G-WCVWL1HMV9"
};

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
    }
}

export default Firebase;