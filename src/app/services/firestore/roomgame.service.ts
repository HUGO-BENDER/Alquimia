import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Roomgame } from '../../model/roomgame';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RoomgameService {

  constructor(private afs: AngularFirestore) {

    }

  createRoomGame(newRoomGame: Roomgame): any {
    return this.afs.collection('RoomGame').add(newRoomGame);
  }

  public getRoomgames() {
    return this.afs.collection('RoomGame').snapshotChanges();
  }

  deleteRoomgame(room: Roomgame): any {
    alert('deleteRoomgame -Method not implemented.');
  }
  joinTheRoomgame(room: Roomgame): any {
    alert('joinTheRoomgame -Method not implemented.');
  }



}
