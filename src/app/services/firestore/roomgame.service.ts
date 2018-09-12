import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { Roomgame, gamestate } from '../../model/roomgame';
import { Observable } from 'rxjs';
import { promise } from 'protractor';

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
    const RoomData = {
      gameId: room.gameId,
      dateCreation: room.dateCreation,
      state: gamestate.START,
      creator: { uid: room.creator.uid, displayName: room.creator.displayName},
      opponent: {uid: userlogined.uid, displayName: userlogined.displayName}
    };
    return this.afs.collection('RoomGame').doc(room.id).set(RoomData);
  }



}
