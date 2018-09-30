"use strict";
// import * as functions from 'firebase-functions';
Object.defineProperty(exports, "__esModule", { value: true });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firestore);
const fdb = admin.firestore();
// exports.addWelcomeMessages = functions.auth.user().onCreate((user) => {
//     const pathPhoto = user.photoURL || '/images/firebase-logo.png';
//     const fullName = user.displayName || 'Anonymous';
//     return fdb.collection('Users').doc(user.uid).set({
//         name: `${fullName}`,
//         profilePicUrl: `${pathPhoto}`
//     });
// });
exports.OnAddNewGame = functions.firestore
    .document('Games/{gameId}')
    .onCreate((newGame, context) => {
    const pathGame = '/Games/' + context.params.gameId;
    // newGame.players.forEach(p => {
    //     fdb.collection('Users').doc(p.uid).collection('Play').doc(context.params.gameId).set({
    //         name: 'aaaaaaaaaa ' + Date.now(),
    //         profilePicUrl: 'pasamos ;-)'
    //     });
    // })
    return fdb.collection('Users').doc().set({
        name: 'hhhheeeeeyyyyyyyy ' + Date.now(),
        juego: newGame.data.toString(),
        profilePicUrl: 'pasamos ;-)'
    });
    // return fdb.collection('Users').doc(user.uid).set({
    //     name: `${fullName}`,
    //     profilePicUrl: `${pathPhoto}`
    // });
    // return newgame.ref.set({
    //     pasamosPorFuncion: true
    //   }, {merge: true});
    //const pathGame = '/Games/' + context.params.gameId1;
    // await admin.database().ref('pruebas').push({ pasamosPorFuncion: true });
    // newgame.ref.update({ pasamosPorFuncion: true });
    // console.log('context.params.gameId = ' + context.params.gameId);
    // newgame.players.forEach(p => {
    //     console.log(p.displayName);
    //     // return admin.database().ref(`/messages/${messageId}`).update({ moderated: true });
    // })
});
//# sourceMappingURL=index.js.map