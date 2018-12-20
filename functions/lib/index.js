//import { stringify } from "@angular/compiler/src/util";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    .onCreate((snap, context) => __awaiter(this, void 0, void 0, function* () {
    try {
        const FieldValue = require('firebase-admin').firestore.FieldValue;
        const pathGame = '/Games/' + context.params.gameId;
        // -- Fake for GetSettingGame.  2 to 4 players. 
        // -- For development only 2 players.
        const ConfigGame = {
            Players: {
                cant: 2,
                hand: 6
            },
            Cards: {
                valueCards: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                descCards: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
                suitsCards: ['ESPADA', 'ORO', 'COPA', 'BASTO', 'TREBOL', 'CORAZON', 'DIAMANTE', 'PICA']
            },
            board: {
                cols: 9,
                rows: 4
            },
            displayedCard: false
        };
        // -- Variable Game actual
        const CurrentGame = {
            Baraja: [{
                    id: 0,
                    position: 0,
                    palo: '',
                    valor: 0,
                    description: '',
                    dragEnable: false,
                    classCss: 'cell-Default'
                }],
            Players: [
                {
                    id: '',
                    hand: []
                }
            ],
            Board: [{
                    id: 0,
                    idUserWin: '',
                    nameUserWin: '',
                    goal: {
                        dragEnable: false,
                        dropEnable: false,
                        classCss: 'goal-Default'
                    },
                    rows: [
                        {
                            idPlayer: '',
                            id: 0,
                            idCol: 0,
                            position: 0,
                            palo: 's',
                            valor: 0,
                            description: 'v',
                            dragEnable: true,
                            dropEnable: true,
                            classCss: 'cell-Default'
                        }
                    ]
                }],
            DisplayedCard: {
                id: 0,
                position: 0,
                palo: '',
                valor: 0,
                description: '',
                dragEnable: false,
                classCss: 'cell-Default'
            }
        };
        // -- End Fake for GetSettingGame.  
        // -- Create collection deck of cards in temporal array
        let cont = 1;
        CurrentGame.Baraja = [];
        for (const s of ConfigGame.Cards.suitsCards) {
            let contValue = 0;
            for (const v of ConfigGame.Cards.valueCards) {
                CurrentGame.Baraja.push({
                    id: cont,
                    position: cont,
                    palo: s,
                    valor: v,
                    description: ConfigGame.Cards.descCards[contValue],
                    dragEnable: true,
                    classCss: 'handCell-Default'
                });
                cont += 1;
                contValue += 1;
            }
        }
        // -- shuffle
        for (let i = CurrentGame.Baraja.length - 1; i >= 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            const positionAtInd = CurrentGame.Baraja[i].position;
            CurrentGame.Baraja[i].position = CurrentGame.Baraja[randomIndex].position;
            CurrentGame.Baraja[randomIndex].position = positionAtInd;
        }
        CurrentGame.Baraja.sort(function (a, b) { return a.position - b.position; });
        // -- players hands
        const totalForPlayers = ConfigGame.Players.cant * ConfigGame.Players.hand;
        const positions = [];
        for (let i = 0; i < ConfigGame.Players.cant; i++) {
            CurrentGame.Players.push({
                id: '_' + i,
                hand: [],
            });
            positions.push(0);
        }
        for (let i = CurrentGame.Baraja.length - 1; i >= CurrentGame.Baraja.length - totalForPlayers; i--) {
            const indexPlayer = i % ConfigGame.Players.cant;
            const cardToHand = {
                id: CurrentGame.Baraja[i].id,
                position: positions[indexPlayer] + 1,
                palo: CurrentGame.Baraja[i].palo,
                valor: CurrentGame.Baraja[i].valor,
                description: CurrentGame.Baraja[i].description,
                dragEnable: true,
                classCss: 'handCell-Default'
            };
            CurrentGame.Players[indexPlayer].hand.push(cardToHand);
            CurrentGame.Baraja[i].id = 0;
            positions[indexPlayer] += 1;
        }
        // -- Card on table
        if (ConfigGame.displayedCard) {
            const cardToDisplay = CurrentGame.Baraja[CurrentGame.Baraja.length - totalForPlayers - 1];
            CurrentGame.DisplayedCard = {
                id: cardToDisplay.id,
                position: cardToDisplay.position,
                palo: cardToDisplay.palo,
                valor: cardToDisplay.valor,
                description: cardToDisplay.description,
                dragEnable: true,
                classCss: 'handCell-Default'
            };
            cardToDisplay.id = 0;
        }
        // -- Creamos la baraja
        for (const c of CurrentGame.Baraja) {
            if (c.id > 0) {
                const k = ('0' + (c.position).toString()).slice(-2);
                yield fdb.doc(pathGame).collection('Baraja').doc(k).set({
                    id: c.id,
                    position: c.position,
                    palo: c.palo,
                    valor: c.valor,
                    description: c.description,
                    dragEnable: false,
                    classCss: 'handCell-Default'
                });
            }
        }
        //-- recuperamos los Id de los jugadores    
        const snapshotplayers = yield fdb.doc(pathGame).collection('Players').get();
        let indPlayer = 0;
        const ramdomFirstTurn = Math.floor(Math.random() * (ConfigGame.Players.cant));
        let ramdomFirstPlayer = '';
        const emptyColumna = [];
        for (const p of snapshotplayers.docs) {
            if (ramdomFirstTurn === indPlayer) {
                ramdomFirstPlayer = p.id;
            }
            indPlayer += 1;
            for (let x = 0; x < ConfigGame.board.rows; x++) {
                emptyColumna.push({
                    idPlayer: p.id,
                    displayNamePlayer: p.data().displayName,
                    id: 0,
                    position: x,
                    palo: '',
                    valor: 0,
                    description: '',
                    dragEnable: x === 0,
                    classCss: 'cell-Default'
                });
            }
        }
        indPlayer = 0;
        // -- Actualizamos la raiz
        if (ConfigGame.displayedCard) {
            snap.ref.set({
                turnCont: 1,
                playerIdTurn: ramdomFirstPlayer,
                timeStart: FieldValue.serverTimestamp(),
                displayedCard: {
                    id: CurrentGame.DisplayedCard.id,
                    position: CurrentGame.DisplayedCard.position,
                    palo: CurrentGame.DisplayedCard.palo,
                    valor: CurrentGame.DisplayedCard.valor,
                    description: CurrentGame.DisplayedCard.description,
                    dragEnable: true,
                    classCss: 'handCell-Default'
                }
            }, { merge: true });
        }
        else {
            snap.ref.set({
                turnCont: 1,
                playerIdTurn: ramdomFirstPlayer,
                timeStart: FieldValue.serverTimestamp(),
            }, { merge: true });
        }
        // -- Creamos el trablero
        for (let x = 0; x < ConfigGame.board.cols; x++) {
            const colKey = 'col' + (('0' + (x).toString()).slice(-2));
            emptyColumna.forEach(function (c) { c.idCol = x; });
            yield fdb.doc(pathGame).collection('BoardGame').doc(colKey).set({
                id: x,
                idPlayerWin: '',
                displayNamePlayerWin: '',
                goal: {
                    dragEnable: false,
                    bet: 0,
                    classCss: 'goal-Default'
                },
                rows: emptyColumna,
            });
        }
        // -- Creamos la mano de los jugadores
        for (const p of snapshotplayers.docs) {
            const x = yield fdb.doc(pathGame).collection('Players').doc(p.id).set({
                hand: CurrentGame.Players[indPlayer].hand
            }, { merge: true });
            const r = yield fdb.collection('Players').doc(p.id).collection('Playing').doc(context.params.gameId).set({
                timeStartGame: FieldValue.serverTimestamp(),
                timeLastTurn: FieldValue.serverTimestamp(),
                name: 'Chinker',
                isMyTurn: ramdomFirstTurn === indPlayer
            });
            indPlayer += 1;
        }
        return Promise.resolve('essssssaaaaaa');
    }
    catch (err) {
        console.log('Error getting documents', err);
        return Promise.reject(err);
    }
}));
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
// console.log('vamos a chequear  la baraja de ', CurrentGame.Baraja.length);
// let TestBaraja = '';
// for (const c of CurrentGame.Baraja) {
//     if (c) {
//         TestBaraja += 'Baraja |' + c.id + '|' + c.position.toString() + '|' + c.description + '_de_' + c.palo + '\r';
//     }
// }
// TestBaraja += 'EnMesa |' + CurrentGame.DisplayedCard.position.toString() + '|' + CurrentGame.DisplayedCard.description + '_de_' + CurrentGame.DisplayedCard.palo + '\r';
// for (const c of CurrentGame.Players[0].hand) {
//     TestBaraja += 'jugador 1 |' + c.position.toString() + '|' + c.description + '_de_' + c.palo + '\r';
// }
// for (const c of CurrentGame.Players[1].hand) {
//     TestBaraja += 'jugador 2 |' + c.position.toString() + '|' + c.description + '_de_' + c.palo + '\r';
// }
// console.log(TestBaraja);
//# sourceMappingURL=index.js.map