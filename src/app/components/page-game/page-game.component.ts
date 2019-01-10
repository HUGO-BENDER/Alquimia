import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { GameService } from 'src/app/services/firestore/game.service';
import { Game, Card, ColumnGame, gameState } from 'src/app/model/game';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { DocumentChangeAction } from 'angularfire2/firestore';
import { FirebaseApp } from 'angularfire2';

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
export class PageGameComponent implements OnInit, OnDestroy {
  idGame: string;
  gameSubscription: Subscription;

  currentGame: Game;
  boardGame: ColumnGame[];
  hand: Array<Card> = [];
  userlogined: firebase.User;
  handCellForceSquare: string;
  boardCellChanged: Array<Card> = [];
  // --
  snackBarVerticalPositionTop: MatSnackBarVerticalPosition = 'top';
  stateButtons = 'outside';
  stateGame: gameState = gameState.WAITING;

  constructor(
    public au: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private afsGame: GameService
  ) { }

  ngOnInit() {
    this.idGame = this.route.snapshot.paramMap.get('id');

    this.au.authState.subscribe(user => {
      if (user) {
        this.userlogined = user;
        this.gameSubscription = this.afsGame.getSnapshotGame(this.idGame).subscribe(snapshotgame => {
          this.startTurn(snapshotgame);
        });
      } else {
        this.userlogined = null;
        this.router.navigate(['home']);
      }
    });
  }

  private startTurn(snapshotgame: any): any {
    this.currentGame = <Game>snapshotgame.payload.data();
    this.stateGame = this.currentGame.playerIdTurn === this.userlogined.uid ? 0 : 1;

    this.afsGame.getHand(this.idGame, this.userlogined).get()
      .then(doc => {
        this.hand = doc.data().hand;
        this.onResize(null);
      })
      .catch(error => { console.log('Error getting hand:', error); });

    this.afsGame.getBoard(this.idGame).get()
      .then( querySnapshot => {
        const oBoardGame: ColumnGame[] = [];
        querySnapshot.forEach(doc => {
          oBoardGame.push(
            <ColumnGame>{
              id: doc.data().id,
              colId: doc.id,
              rows: [],
              idPlayerWin: doc.data().idPlayerWin,
              displayNamePlayerWin: doc.data().displayNamePlayerWin
            });
            this.getColumns(doc.data().rows, false).forEach(c => {oBoardGame[doc.data().id].rows.push(c); });
            oBoardGame[doc.data().id].rows.push(<Card>{
              idPlayer: '',
              displayNamePlayer: 'GOAL',
              id: -1,
              idCol: doc.data().id,
              position: 0,
              palo: doc.id,
              valor: doc.id,
              description: 'goal',
              dragEnable: false
            });
            this.getColumns(doc.data().rows, true).forEach(c => {oBoardGame[doc.data().id].rows.push(c); });
        });
        this.boardGame = oBoardGame;
      })
      .catch(error => { console.log('Error getting boardGame:', error); });
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
    this.boardCellChanged = [];
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
    const idGame = this.route.snapshot.paramMap.get('id');
    this.afsGame.senTurn(
      this.hand, this.boardCellChanged,
      idGame, this.userlogined.uid, this.currentGame.turnCont
    )
      .then(() => {
        console.log('xSe ha enviado el Turno');
        this.stateButtons = 'outside';
        this.stateGame = gameState.WAITING;
        this.openSnackBar('xSe ha enviado el Turno');
      })
      .catch((error) => {
        this.openSnackBar('xError :-( ');
        console.log('Error adding document: ', error);
      });
  }

  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
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

  public openSnackBar(mensaje: string): any {
    this.snackBar.open(mensaje, 'xClose', {
      duration: 5000,
      verticalPosition: this.snackBarVerticalPositionTop
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
