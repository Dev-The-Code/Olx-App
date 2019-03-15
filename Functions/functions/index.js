const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.sendNotification = functions.database.ref('/users/chatRoom/{key}')
    .onWrite((event) => {
        const payload = {
            notification: {
                title: 'New Message from',
                body: event.after._data.message,
                status: 'Wohoo its work',
                click_action: 'https://testing-project-development.firebaseapp.com'
            }
        }
        const reciverId =event.after._data.reciverId;
            console.info(payload)

        return admin.database().ref(`users/${reciverId}/{key}/`).once('value').then((data) => {

            // if (!data.val()) return;

            const snapshot = data.val();
            const token = snapshot.token;

            return admin.messaging().sendToDevice(token, payload);
        });
    })

