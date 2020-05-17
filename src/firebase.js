import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyAL4-e1yaR--dwRB8NTANeWBN74tQa7RVw",
    authDomain: "recorder-app-7146b.firebaseapp.com",
    databaseURL: "https://recorder-app-7146b.firebaseio.com",
    projectId: "recorder-app-7146b",
    storageBucket: "recorder-app-7146b.appspot.com",
    messagingSenderId: "783016789771",
    appId: "1:783016789771:web:788993b38529575d00440e",
    measurementId: "G-R6KKBFKX1V"
};

firebase.initializeApp(firebaseConfig);
export default firebase;