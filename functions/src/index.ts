//import { flattenStyles } from "@angular/platform-browser/src/dom/dom_renderer";

// import * as functions from 'firebase-functions';

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
    .onCreate(async (snap, context) => {

        try {
            const FieldValue = require('firebase-admin').firestore.FieldValue;
            const pathGame = '/Games/' + context.params.gameId;
            const newGame = snap.data();

            // // -- Fake for GetSettingGame.  2 to 4 players. 
            // // -- For development only 2 players.
            // const configGame = {
            //     players: {
            //         cant: 2,
            //         hand: 5
            //     },
            //     cards: {
            //         valueCards: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            //         descCards: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
            //         suitsCards: ['ESP', 'ORO', 'COP', 'BAS', 'TRE', 'COR', 'DIA', 'PIC']
            //     },
            //     board: {
            //         cols: 9,
            //         rows: 4
            //     }
            // }

            // // -- Variable Game actual
            // const CurrentGame = {
            //     Baraja : [],
            //     Players: [
            //         {
            //             id: '',
            //             hand: []
            //         }
            //     ],
            //     Board: [{
            //         Id: 0,
            //         IdUserWin: '',
            //         NameUserWin: '',
            //         Target: {
            //             Id: 0,
            //             dropEnable: false,
            //             classCss: 'planet '
            //         },
            //         Players: [{
            //             Id: '',
            //             Name: '',
            //             Displayed: []
            //         }]
            //     }],
            //     DisplayedCard: {}
            // };

            // // -- Create collection deck of cards in temporal array
            // let cont = 1;
            // for (const s of configGame.cards.suitsCards) {
            //     for (const v of configGame.cards.valueCards) {
            //         CurrentGame.Baraja.push({
            //             id: cont,
            //             palo: s,
            //             valor: v,
            //             index: 0,
            //             dragEnable: false,
            //             classCss: 'card '
            //         });
            //         cont += 1;
            //     }
            // }
            // // -- shuffle
            // for (let i = CurrentGame.Baraja.length - 1; i >= 0; i--) {
            //     const randomIndex = Math.floor(Math.random() * (i + 1));
            //     const itemAtIndex = CurrentGame.Baraja[randomIndex];
            //     CurrentGame.Baraja[randomIndex] = CurrentGame.Baraja[i];
            //     CurrentGame.Baraja[i] = itemAtIndex;
            // }
            // // -- players hands
            // let indexLast = CurrentGame.Baraja.length - 1;
            // const totalForPlayers = configGame.players.cant * configGame.players.hand;

            // for (let i = 0; i < totalForPlayers; i++) {
            //     const indexPlayer = (i + configGame.players.cant) % configGame.players.cant;
            //     CurrentGame.Players[indexPlayer].hand.push(CurrentGame.Baraja[indexLast]);
            //     CurrentGame.Players[indexPlayer].hand[CurrentGame.Players[indexPlayer].hand.length - 1].dragEnable = true;
            //     CurrentGame.Players[indexPlayer].hand[CurrentGame.Players[indexPlayer].hand.length - 1].index = CurrentGame.Players[indexPlayer].hand.length;
            //     indexLast--;
            //     CurrentGame.Baraja.pop();
            // }
            // // -- Card on table
            // CurrentGame.DisplayedCard = CurrentGame.Baraja[indexLast];
            // CurrentGame.Baraja.pop();
            // // -- Boardgame
            // for (let x = 0; x < configGame.board.cols; x++) {
            //     CurrentGame.Board.push({
            //         Id: x,
            //         IdUserWin: '',
            //         NameUserWin: '',
            //         Target: {
            //             Id: x,
            //             dropEnable: false,
            //             classCss: 'planet '
            //         },
            //         Players: []
            //     }); 
            // }

            // const snapshotplayers = await fdb.doc(pathGame).collection('Players').get();
            // // tslint:disable-next-line:prefer-const
            // for (let p of snapshotplayers.docs) {
            //     const r = await fdb.collection('Players').doc(p.id).collection('Playing').doc(context.params.gameId).set({
                    
            //         timestamp: FieldValue.serverTimestamp(),
            //         name: 'Chinker'
            //     });
            // }

            // for (let p of newGame.Players) {

            // }



            console.log('newGame.gameType es ', newGame.gameType);
            snap.ref.set(
                {
                    timeStart: FieldValue.serverTimestamp(),
                },
                {
                    merge: true
                }
            )

            console.log('pasamos el  snap.ref.set');






            return Promise.resolve('essssssaaaaaa');
        }
        catch (err) {
            console.log('Error getting documents', err);
            return Promise.reject(err);
        }





        // let textoLibre: string = '';

        // newGame.players.forEach(p => {
        //     fdb.collection('Users').doc(p.uid).collection('Playing').doc(context.params.gameId).set({
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


    }
    );