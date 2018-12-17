import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Card } from 'src/app/model/game';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private afs: AngularFirestore) { }

  public getGame(id: string) {
    return this.afs.collection('Games').doc(id).ref;
  }

  public getHand(id: string, userlogined: firebase.User) {
    return this.afs.collection('Games').doc(id)
                   .collection('Players').doc(userlogined.uid).ref;
  }

  public getBoard(id: string) {
    return this.afs.collection('Games').doc(id).collection('BoardGame').snapshotChanges();
  }

  public senTurn(hand: Array<Card>, boardChanged: Array<Card>,
                 idGame: string, uid: string, contTurn: number) {
    const keyTurn = ('00' + (contTurn).toString()).slice(-3) + '-' + uid;
    return this.afs.collection('Games').doc(idGame)
                    .collection('Turns').doc(keyTurn).set(
                      {
                        userId: uid,
                        hand: 'hand.values',
                        boardChanged: 'boardChanged.values'
                      }
                    );
  }

}
