const firebaseConfig = {
    apiKey: "AIzaSyB4sz3w6d7sWBWlqMMHWUGJ6Zjn7ULnuD0",
    authDomain: "companion-d01bb.firebaseapp.com",
    projectId: "companion-d01bb",
    storageBucket: "companion-d01bb.appspot.com",
    messagingSenderId: "87404646992",
    appId: "1:87404646992:web:e3d8d4a5cce3d7575a7755",
    measurementId: "G-4YP24LS2X8"
};

firebase.initializeApp(firebaseConfig);

// make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();

// update firestore settings
db.settings({ timestampsInSnapshots: true });