import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private afs: AngularFirestore) { }

  public getGamesInProgress(userlogined: firebase.User) {
    return this.afs.collection('Players').doc(userlogined.uid).collection('Playing').snapshotChanges();
  }




}
