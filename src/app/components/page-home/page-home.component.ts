import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { RoomgameService } from '../../services/firestore/roomgame.service';
import { Roomgame, gamestate } from '../../model/roomgame';
import * as firebase from 'firebase';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {

  cards = [
    // { title: 'Card 1', cols: 2, rows: 1 },
    { title: 'Card 2', cols: 1, rows: 1 },
    { title: 'Card 3', cols: 1, rows: 2 },
    { title: 'Card 4', cols: 1, rows: 1 }
  ];

  roomgames: Observable<Roomgame[]>;
  userlogined: firebase.User;
  snackBarVerticalPositionTop: MatSnackBarVerticalPosition = 'top';

  constructor(public au: AngularFireAuth, private afsGameRooms: RoomgameService, public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.au.authState.subscribe(user => {
      if (user) {
        this.userlogined = user;
      } else {
        this.userlogined = null;
      }
    });

    this.roomgames = this.afsGameRooms.getRoomgames().map(
      actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Roomgame;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      }
    );
  }

  createRoomGame() {
    if (this.userlogined) {
      const newRoomGame: Roomgame = {
        gameId: 'shottem',
        dateCreation: firebase.firestore.FieldValue.serverTimestamp(),
        state: gamestate.OPEN,
        creator: { uid: this.userlogined.uid, displayName: this.userlogined.displayName }
      };
      this.afsGameRooms.createRoomGame(newRoomGame)
        .then(function (docRef) {
          console.log('Document written with ID: ', docRef.id);
        })
        .catch(function (error) {
          console.error('Error adding document: ', error);
        });
    } else {
      this.openSnackBar('xNo se puede ejecutar esta acción sin estar loginado');
    }
  }

  canDelete(room: Roomgame): boolean {
    if (this.userlogined) {
      if (room.creator.uid === this.userlogined.uid) {
        return true;
      }
    }
    return false;
  }

  deleteRoomgame(room: Roomgame) {
    this.afsGameRooms.deleteRoomgame(room)
      .then(function () {
        this.openSnackBar('xGame delete.');
      })
      .catch(function (error) {
        this.openSnackBar('xError deleting game.');
      });
  }

  canJoin(room: Roomgame): boolean {
    if (this.userlogined) {
      if (room.creator.uid !== this.userlogined.uid) {
        return true;
      }
      return false;
    }
    // -- Si no está loginado queremos que intente unirse para invitarlo
    return true;
  }

  joinTheRoomgame(room: Roomgame) {
    if (this.userlogined) {
      this.afsGameRooms.joinTheRoomgame(room, this.userlogined)
        .then( this.checkIfRoomReady(room) )
        .catch(function (error) {
          console.error('Error editing document: ', error);
        });
    } else {
      this.openSnackBar('xNo se puede ejecutar esta acción sin estar loginado');
    }
  }

  checkIfRoomReady(room: Roomgame) {
    this.openSnackBar('xHeeeeyyy ' + room.opponent.displayName  + ' te has unido al juego');
    // Conditions for start the game. Simple. There are only 2 players.
    // Then... go. Start the game
    this.afsGameRooms.createGameFromThisRoom(room);


  }


  openSnackBar(mensaje: string): any {
    this.snackBar.open(mensaje, 'xClose', {
      duration: 5000,
      verticalPosition: this.snackBarVerticalPositionTop
    });
  }

}
