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

            console.log('podemos leer newGame.gameType : ', newGame.gameType);
            // -- Fake for GetSettingGame.  2 to 4 players. 
            // -- For development only 2 players.
            const ConfigGame = {
                Players: {
                    cant: 2,
                    hand: 5
                },
                Cards: {
                    valueCards: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    descCards: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
                    suitsCards: ['ESPADA', 'ORO', 'COPA', 'BASTO', 'TREBOL', 'CORAZON', 'DIAMANTE', 'PICA']
                },
                board: {
                    cols: 9,
                    rows: 4
                }
            }

            console.log('ConfigGame');
            // -- Variable Game actual
            const CurrentGame = {
                Baraja: [{
                    id: 0,
                    position: 0,
                    palo: '',
                    valor: 0,
                    description: '',
                    dragEnable: false,
                    classCss: 'card'
                }],
                Players: [
                    {
                        id: '',
                        hand: []
                    }
                ],
                Board: [{
                    Id: 0,
                    IdUserWin: '',
                    NameUserWin: '',
                    Target: {
                        id: 0,
                        dropEnable: false,
                        classCss: 'goal'
                    },
                    Players: [{
                        Id: '',
                        Name: '',
                        Displayed: []
                    }]
                }],
                DisplayedCard: { 
                    id: 0,
                    position: 0,
                    palo: '',
                    valor: 0,
                    description: '',
                    dragEnable: false,
                    classCss: 'card'
                }
            };


            console.log('CurrentGame');
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
                        dragEnable: false,
                        classCss: 'card '
                    });
                    cont += 1;
                    contValue += 1;
                }
            }

            console.log('creamos la baraja con ', CurrentGame.Baraja.length, ' cartas');
            // -- shuffle
            for (let i = CurrentGame.Baraja.length - 1; i >= 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                CurrentGame.Baraja[randomIndex].position = i;
                CurrentGame.Baraja[i].position = randomIndex;
            }

            console.log('mezclamos');
            // -- players hands
            const totalForPlayers = ConfigGame.Players.cant * ConfigGame.Players.hand;
            console.log('totalForPlayers', totalForPlayers);

            for (let i = 0; i < ConfigGame.Players.cant; i++) {
                CurrentGame.Players.push({
                    id: '_' + i,
                    hand:[],
                });
            }
            console.log('creamos el array de jugadores');
            for (let i = 0; i < totalForPlayers; i++) {
                const indexPlayer = (i + ConfigGame.Players.cant) % ConfigGame.Players.cant;
                CurrentGame.Players[indexPlayer].hand.push(CurrentGame.Baraja.pop());
                CurrentGame.Players[indexPlayer].hand[CurrentGame.Players[indexPlayer].hand.length - 1].dragEnable = true;
                CurrentGame.Players[indexPlayer].hand[CurrentGame.Players[indexPlayer].hand.length - 1].index = CurrentGame.Players[indexPlayer].hand.length;
            }
            console.log('cargamos la mano de los jugadores');
            // -- Card on table
            CurrentGame.DisplayedCard = CurrentGame.Baraja.pop();
            console.log('pusimos la carta en la mesa');

            // // -- Boardgame
            // for (let x = 0; x < ConfigGame.board.cols; x++) {
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
                    displayedCard: { 
                        id: CurrentGame.DisplayedCard.id,
                        position: CurrentGame.DisplayedCard.position,
                        palo: CurrentGame.DisplayedCard.palo,
                        valor: CurrentGame.DisplayedCard.valor,
                        dragEnable: true,
                        classCss: 'card displayed onTable'
                    }
                },{merge: true}
            )

            console.log('pasamos el  snap.ref.set');
            console.log('vamos a buclear la baraja de ', CurrentGame.Baraja.length);
            //  for (const c of CurrentGame.Baraja) {
            //     console.log(c.position.toString(),c.description,'_de_',c.palo );
            // }

            // console.log('pasamos el  for de pruebas');

            for (const c of CurrentGame.Baraja) {
                const k = ('0' + c.position.toString()).slice(-2);
                console.log('la clave es ', k);
                const r = await fdb.doc(pathGame).collection('Baraja').doc(k).set({
                    id: c.id,
                    position: c.position,
                    palo: c.palo,
                    valor: c.valor,
                    description: c.description,
                    dragEnable: false,
                    classCss: 'card'
                });


                // const r = await fdb.doc(pathGame).collection('Baraja').doc(c.description + '-'+ c.palo).set({
                //     id: c.id,
                //     position: c.id,
                //     palo: c.palo,
                //     valor: c.valor,
                //     description: c.description,
                //     dragEnable: false,
                //     classCss: 'card'
                // });
            }

            console.log('snap.ref.collection(Baraja).doc');





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