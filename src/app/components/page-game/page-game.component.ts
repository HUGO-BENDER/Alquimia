import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GameService } from 'src/app/services/firestore/game.service';
import { Game, Card, ColumnGame } from 'src/app/model/game';
import * as firebase from 'firebase';

@Component({
  selector: 'app-page-game',
  templateUrl: './page-game.component.html',
  styleUrls: ['./page-game.component.scss']
})
export class PageGameComponent implements OnInit {

  currentGame: Game;
  boardGame: Observable<ColumnGame[]>;
  hand: Array<Card> = [];
  userlogined: firebase.User;

  constructor(
    public au: AngularFireAuth,
    private route: ActivatedRoute,
    private afsGame: GameService
  ) { }

  ngOnInit() {
    const idGame = this.route.snapshot.paramMap.get('id');

    this.au.authState.subscribe(user => {
      if (user) {
        this.userlogined = user;
        this.afsGame.getHand(idGame, user).get()
          .then(doc => {
            this.hand = doc.data().hand;
          })
          .catch(error => { console.log('Error getting document:', error); });
      } else {
        this.userlogined = null;
      }
    });

    this.afsGame.getGame(idGame).get()
      .then(doc => { this.currentGame = <Game>doc.data(); })
      .catch(error => { console.log('Error getting document:', error); });

    this.boardGame = this.afsGame.getBoard(idGame).map(
      actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as ColumnGame;
          const colId = action.payload.doc.id;
          console.log(action.payload.doc.data());
          return { colId, ...data };
        });
      }
    );
  }

  public getColumns (boardCols: Array<Card>, mySide: boolean): Array<Card> {
    let cols: Array<Card> = [];
      if (mySide) {
        cols = boardCols.filter(c => c.idPlayer === this.userlogined.uid);
        cols = cols.sort(function (a, b) { return a.position - b.position; });
      } else {
        cols = boardCols.filter(c => c.idPlayer !== this.userlogined.uid);
        cols = cols.sort(function (a, b) { return b.position - a.position; });
      }
    return cols;
  }





}
