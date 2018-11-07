import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private afs: AngularFirestore) { }

  public getGame(id: string) {
    console.log('--- getGame(id) ---', id);
    return this.afs.collection('Games').doc('vIrCv5U20WDpyiyfG5Zu').ref;
  }

  public getHand(id: string, userlogined: firebase.User) {
    return this.afs.collection('Games').doc(id).ref.get();
  }




}
