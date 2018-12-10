import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute } from '@angular/router';
// import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
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
  piezaEnJuego: Card;

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
  // -- Hand D&D
  public onHandDragStart(c: Card) {
    this.piezaEnJuego = c;
    c.classCss = 'handCell-OnDrag ';
  }
  public onHandDragEnd() {
    if (this.piezaEnJuego.dragEnable) {
      this.piezaEnJuego.classCss = 'handCell-Default ';
    }
  }
  public onHandDragOver(e: any, c: Card) {
    if (this.piezaEnJuego.id !== c.id) {
      c.classCss = 'handCell-OnDragOver ';
    }
    e.preventDefault();
  }
  public onHandDragLeave(e: any, c: Card) {
    if (this.piezaEnJuego.id !== c.id) {
      c.classCss = 'handCell-Default ';
    }
    e.preventDefault();
  }
  public onHandDrop(c: Card) {
    c.classCss = 'handCell-Default ';
    const ini = c.position;
    if (c.position < this.piezaEnJuego.position) {
      for (let i = c.position; i < this.piezaEnJuego.position; i++) {
        this.hand[i - 1].position = i + 1;
      }
      this.piezaEnJuego.position = ini;
    } else {
      for (let i = this.piezaEnJuego.position; i < c.position; i++) {
        this.hand[i].position = i;
      }
      this.piezaEnJuego.position = ini;
    }
    this.hand.sort(function (a, b) { return a.position - b.position; });
  }
  // -- Board
  public onBoardDragStart(c: Card) {
    this.piezaEnJuego = c;
    c.classCss = 'boardCell-OnDrag ';
  }
  public onBoardDragEnd() {
    this.piezaEnJuego.classCss = 'boardCell-Default ';
  }
  public onBoardDragOver(e: any, col: ColumnGame, card: Card) {

    console.log('estoy sobre el ', col.id + '/' + card.position + '#' + card.displayNamePlayer, ' puedo? ', card.dragEnable);
    if (card.dragEnable) {
      card.classCss = 'boardCell-OnDragOver';
      e.preventDefault();
    } else {
      card.classCss = 'boardCell-denyDragOver';
    }
  }
  public onBoardDragLeave(e: any, card: Card) {
    card.classCss = card.id === '0' ? 'boardCell-Default' : 'handCell-Default';
    e.preventDefault();
  }
  public onBoardDrop(col: ColumnGame, c: Card) {
    this.copyValues(this.piezaEnJuego, c);
    for (const hc of this.hand) {
      hc.dragEnable = false;
    }
    this.stateButtons = 'dentro';
  }
  public resetTurn() {

    for (const hc of this.hand) {
      hc.dragEnable = true;
    }
    this.stateButtons = 'fuera';
  }
  public copyValues(valuesFrom: Card, valuesTo: Card) {
    valuesTo.id = valuesFrom.id;
    valuesTo.valor = valuesFrom.valor;
    valuesTo.description = valuesFrom.description;
    valuesTo.palo = valuesFrom.palo;
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
