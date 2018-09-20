import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { Roomgame, gamestate } from '../../model/roomgame';

@Injectable({
  providedIn: 'root'
})

export class RoomgameService {
  constructor(private afs: AngularFirestore) {
  }

  createRoomGame(newRoomGame: Roomgame): Promise<DocumentReference> {
    return this.afs.collection('RoomGame').add(newRoomGame);
  }

  public getRoomgames() {
    return this.afs.collection('RoomGame').snapshotChanges();
  }

  deleteRoomgame(room: Roomgame): Promise<void> {
    return this.afs.collection('RoomGame').doc(room.id).delete();
  }

  joinTheRoomgame(room: Roomgame, userlogined: firebase.User): any {
    const rgRef = this.afs.collection('RoomGame').doc(room.id).ref;
    return this.afs.firestore.runTransaction(
      transJoinGame => transJoinGame.get(rgRef).then(
        sfDoc => {
          if (sfDoc.data().state === gamestate.OPEN) {
            transJoinGame.update(rgRef, { state: gamestate.START, opponent: { uid: userlogined.uid, displayName: userlogined.displayName } }
            );
          } else {
            return Promise.reject('Sorry! Too late.');
          }
        }
      )
    );
  }

  createGameFromThisRoom(room: Roomgame): any {
    const batch = this.afs.firestore.batch();

    const newGameRef = this.afs.collection('Game').doc(this.createId()).ref;

    const newGame = { name: 'Este es el nuevo juego' };
    batch.set(newGameRef, newGame);

    const rgRef = this.afs.collection('RoomGame').doc(room.id).ref;
    batch.delete(rgRef);

    batch.commit().then(res => console.log('Batch completed!'), err => console.error(err));

  }

  createId() {
    return this.afs.firestore.collection('_').doc().id;
  }

}
