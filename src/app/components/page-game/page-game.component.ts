import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GameService } from 'src/app/services/firestore/game.service';
import { Game, Card, ColumnGame } from 'src/app/model/game';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as firebase from 'firebase';

@Component({
  selector: 'app-page-game',
  templateUrl: './page-game.component.html',
  styleUrls: ['./page-game.component.scss'],
  animations: [
    trigger('animAparecer', [
      state('fuera', style({
        transform: 'translateX(-100%)',
      })),
      state('dentro', style({
        transform: 'translateX(0)',
      })),
      transition('fuera <=> dentro', animate('300ms')),
    ])
  ]
})
export class PageGameComponent implements OnInit {

  currentGame: Game;
  boardGame: Observable<ColumnGame[]>;
  matrixBoardGame: Array<Card> = [];
  hand: Array<Card> = [];
  userlogined: firebase.User;
  stateButtons = 'fuera';

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
          return { colId, ...data };
        });
      }
    );

    this.boardGame.subscribe(arr => {
      this.matrixBoardGame = this.getMatrixOf(arr);
    });

  }

  public getMatrixOf(cols): Array<Card> {
    const matrix: Array<Card> = Array(81).fill({}) ;
    for (const c of cols) {
      for (const ca of c.rows) {
        ca.idCol = c.id;
        if (ca.idPlayer === this.userlogined.uid) {
          matrix[ (45 + (c.id ) + (ca.position * 9))] = ca;
        } else {
          matrix[ (c.id ) + (( 3 - ca.position ) * 9)] = ca;
        }
      }
    }
    return matrix;
  }

  public getColumns(boardCols: Array<Card>, mySide: boolean): Array<Card> {
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
