import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';


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
                   .collection('Players').doc(userlogined.uid)
                   .collection('Hand').ref;
  }

  public getBoard(id: string) {
    return this.afs.collection('Games').doc(id)
                   .collection('BoardGame').snapshotChanges();
  }



}