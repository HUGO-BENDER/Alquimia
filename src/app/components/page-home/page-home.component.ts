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

  roomgames: Array<any>;
  user: Observable<firebase.User>;

  constructor(public au: AngularFireAuth, private afsGameRooms: RoomgameService) { }

  ngOnInit() {
    this.user = this.au.authState;
    this.afsGameRooms.getRoomgames().subscribe((snapshot) => {
      this.roomgames = [];
      snapshot.forEach((oData: any) => {
        this.roomgames.push({
          id: oData.payload.doc.id,
          data: oData.payload.doc.data()
        });
      });
    });
  }

  createRoomGame() {
    alert('creamos un nuevo juego');


    const newRoomGame: Roomgame = {
      gameId: 'shottem',
      dateCreation: firebase.firestore.FieldValue.serverTimestamp(),
      state: gamestate.OPEN,
      creator: { uid: 'xx', displayName: 'ccccccc'}
    };

    this.afsGameRooms.createRoomGame(newRoomGame)
      .then(function (docRef) {
        console.log('Document written with ID: ', docRef.id);
      })
      .catch(function (error) {
        console.error('Error adding document: ', error);
      });
  }








}
