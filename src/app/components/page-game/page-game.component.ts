import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
    trigger('animAppear', [
      state('outside', style({
        position: 'absolute',
        transform: 'translateX(-100%)',
      })),
      state('inside', style({
        position: 'relative',
        transform: 'translateX(0)',
      })),
      transition('outside <=> inside', animate('300ms')),
    ])
  ]
})
export class PageGameComponent implements OnInit {
  currentGame: Game;
  boardGame: Observable<ColumnGame[]>;
  hand: Array<Card> = [];
  userlogined: firebase.User;
  stateButtons = 'outside';
  handCellForceSquare: string;
  boardCellChanged: Array<Card> = [];

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
            this.onResize(null);
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

  // -- layout
  public onResize(event: any) {
    if (window.innerWidth * 0.96 / this.hand.length < window.innerHeight * 0.15) {
      this.handCellForceSquare = 'handCellSquareVW';
    } else {
      this.handCellForceSquare = 'handCellSquareVH';
    }
    for (const hc of this.hand) {
      hc.classCss = this.handCellForceSquare;
    }
  }

  // -- Hand D&D
  public onHandDrop(event: CdkDragDrop<Card[]>) {
    moveItemInArray(this.hand, event.previousIndex, event.currentIndex);
    for (let i = 0; i < this.hand.length; i++) {
      event.container.data[i].position = i;
    }
  }
  // -- Board
  public onBoardDrop(event: CdkDragDrop<Card[]>, c: Card) {
    const ori = event.previousContainer.data[event.previousIndex];
    this.boardCellChanged.push(c);
    this.copyValues(ori, c, true);
    this.copyValues(null, ori, true);
    for (const hc of this.hand) {
      hc.dragEnable = false;
    }
    this.stateButtons = 'inside';
  }
  // -- Botons
  public resetTurn() {
    for (const hc of this.hand) {
      hc.dragEnable = true;
      if (hc.previousValues) {
        this.copyValues(hc.previousValues, hc, false);
        hc.previousValues = null;
      }
    }
    for (const bc of this.boardCellChanged) {
      if (bc.previousValues) {
        this.copyValues(bc.previousValues, bc, false);
        bc.previousValues = null;
      }
    }
    this.boardCellChanged = [];
    this.stateButtons = 'outside';
  }
  public sendTurn() {
    alert('Vamos a enviar el turno');
  }
  // -- Auxiliar functions
  public copyValues(valuesFrom: Card, valuesTo: Card, bk: boolean) {
    if (bk) {
      valuesTo.previousValues = {
        idPlayer: valuesTo.idPlayer,
        displayNamePlayer: valuesTo.displayNamePlayer,
        id: valuesTo.id,
        position: valuesTo.position,
        palo: valuesTo.palo,
        valor: valuesTo.valor,
        description: valuesTo.description,
        dragEnable: valuesTo.dragEnable,
        classCss: valuesTo.classCss
      };
    }
    if (valuesFrom) {
      valuesTo.id = valuesFrom.id;
      valuesTo.valor = valuesFrom.valor;
      valuesTo.description = valuesFrom.description;
      valuesTo.palo = valuesFrom.palo;
    } else {
      valuesTo.id = null;
      valuesTo.valor = null;
      valuesTo.description = null;
      valuesTo.palo = null;
    }
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
