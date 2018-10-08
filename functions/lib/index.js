// import * as functions from 'firebase-functions';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);
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
    .onCreate((newGame, context) => __awaiter(this, void 0, void 0, function* () {
    try {
        const pathGame = '/Games/' + context.params.gameId;
        const snapshotplayers = yield fdb.doc(pathGame).collection('Players').get();
        // tslint:disable-next-line:prefer-const
        for (let player of snapshotplayers.docs) {
            console.log(player.id, ' => ', player.data());
        }
        return Promise.resolve('essssssaaaaaa');
    }
    catch (err) {
        console.log('Error getting documents', err);
        return Promise.reject(err);
    }
    // let textoLibre: string = '';
    // newGame.players.forEach(p => {
    //     fdb.collection('Users').doc(p.uid).collection('Play').doc(context.params.gameId).set({
    //         name: 'aaaaaaaaaa ' + Date.now(),
    //         profilePicUrl: 'pasamos ;-)'
    //     });
    // })
    // const algundatocarajo = newGame.data().gameType;
    // console.log('vale, recibo datos del newgame. algundatocarajo es ', algundatocarajo, ' <= terminó');
    // const juegoActual:
    // return fdb.doc(pathGame).collection('Players').get()
    //     .then((snapshot) => {
    //         snapshot.forEach((player) => {
    //             textoLibre = textoLibre + ' -- ' + player.id + '=>' + player.data();
    //             console.log(player.id, ' => ', player.data());
    //         });
    //     }).then(() =>
    //         fdb.collection('Users').doc().set({
    //             name: 'hhhheeeeeyyyyyyyy ' + Date.now().toLocaleString(),
    //             juego: 'aca va el text ' + textoLibre,
    //             profilePicUrl: 'pasamos ;-)'
    //         })
    //     );
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
}));
//# sourceMappingURL=index.js.map