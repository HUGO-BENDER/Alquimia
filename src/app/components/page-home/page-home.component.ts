import { Component, OnInit } from '@angular/core';
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

  constructor(public au: AngularFireAuth, private afsGameRooms: RoomgameService) { }

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
      alert('no se puede crear un juego sin estar loginado');
    }

  }








}
