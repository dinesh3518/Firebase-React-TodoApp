import firebase from 'firebase/compat/app'
import "firebase/compat/auth"
import 'firebase/compat/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
const app = firebase.initializeApp({
    apiKey: "AIzaSyBik3cv8JQr36M42u_JBlR8pchGqUTUQz4",
    authDomain: "chat-app-ca459.firebaseapp.com",
    projectId: "chat-app-ca459",
    storageBucket: "chat-app-ca459.appspot.com",
    messagingSenderId: "408222722823",
    appId: "1:408222722823:web:1ea2dd570a6ebb97ac33a2",
    measurementId: "G-TWKRLQQWD6"
})

export const auth = app.auth()
export const authG = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const storage=getStorage(app);
export default app
