importScripts('https://www.gstatic.com/firebasejs/5.0.4/firebase-app.js');

var config = {
    apiKey: "AIzaSyDSJRERtDglhl0Q7uUXlYLrHeF7jdvZjyg",
    authDomain: "hackathon-bdffa.firebaseapp.com",
    databaseURL: "https://hackathon-bdffa.firebaseio.com",
    projectId: "hackathon-bdffa",
    storageBucket: "hackathon-bdffa.appspot.com",
    messagingSenderId: "468663877156"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();

