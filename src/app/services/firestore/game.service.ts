import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Card } from 'src/app/model/game';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private afs: AngularFirestore) { }

  public getSnapshotGame(id: string) {
    return this.afs.collection('Games').doc(id).snapshotChanges();
  }

  public getHand(id: string, userlogined: firebase.User) {
    return this.afs.collection('Games').doc(id)
                   .collection('Players').doc(userlogined.uid).ref;
  }

  public getBoard(id: string) {
    return this.afs.collection('Games').doc(id).collection('BoardGame').ref;
  }

  public senTurn(hand: Array<Card>, boardChanged: Array<Card>,
                 idGame: string, uid: string, contTurn: number) {
    const keyTurn = ('00' + Math.trunc(contTurn).toString()).slice(-3);

    const arrayCardsInHands: Array<any> = [];
    for (const hc of hand) {
      arrayCardsInHands.push({
        id: hc.id,
        position: hc.position,
        description: hc.description,
        palo: hc.palo,
        valor: hc.valor
      });
    }

    const arrayCellInBoard: Array<any> = [];
    for (const bc of boardChanged) {
      arrayCellInBoard.push({
        id: bc.id,
        idCol: bc.idCol,
        position: bc.position,
        description: bc.description,
        palo: bc.palo,
        valor: bc.valor
      });
    }

    return this.afs.collection('Games').doc(idGame)
                    .collection('Players').doc(uid)
                    .collection('Turns').doc(keyTurn).set(
                      {
                        sendAt: new Date(),
                        hand: arrayCardsInHands,
                        boardChanged: arrayCellInBoard
                      }
                    );
  }

}
