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
        position: 'absolute',
        transform: 'translateX(-100%)',
      })),
      state('dentro', style({
        position: 'relative',
        transform: 'translateX(0)',
      })),
      transition('fuera <=> dentro', animate('300ms')),
    ])
  ]
})
export class PageGameComponent implements OnInit {

  currentGame: Game;
  boardGame: Observable<ColumnGame[]>;
  hand: Array<Card> = [];
  userlogined: firebase.User;
  stateButtons = 'fuera';
  piezaJugada: Card;


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

  public onDragStart(c: Card) {
    console.log('Empezamos. estoy arrastrando un ' + c.description + ' de ', c.palo);
    this.piezaJugada = c;
    // -- c.border = '3px dashed black';
  }
  public finArrastre() {
    // this.piezaJugada.border = '3px solid #999999';
    console.log('Se terminó');
  }
  public onDragOverMano(e: any, c: Card) {
    e.preventDefault();
  }

  public onDropMano(c: Card) {
    const ini = c.position;
    const fin = this.piezaJugada.position;
    if (c.position < this.piezaJugada.position) {
      for (let i = c.position; i < this.piezaJugada.position; i++) {
        this.hand[i - 1].position = i + 1;
      }
      this.piezaJugada.position = ini;
    } else {
      for (let i = this.piezaJugada.position ; i < c.position; i++) {
        this.hand[i].position = i;
      }
      this.piezaJugada.position = ini;
    }
    this.reordenarMano();
  }





  public reordenarMano() {
    this.hand.sort(function(a, b) {
        if ( a.position < b.position ) {
            return -1;
        }
        if ( a.position > b.position ) {
            return 1;
        }
        return 0;
    });
}

}


  // public getMatrixOf(cols): Array<Card> {
  //   const matrix: Array<Card> = Array(81).fill({}) ;
  //   for (const c of cols) {
  //     for (const ca of c.rows) {
  //       ca.idCol = c.id;
  //       if (ca.idPlayer === this.userlogined.uid) {
  //         matrix[ (45 + (c.id ) + (ca.position * 9))] = ca;
  //       } else {
  //         matrix[ (c.id ) + (( 3 - ca.position ) * 9)] = ca;
  //       }
  //     }
  //   }
  //   return matrix;
  // }
