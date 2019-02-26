import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatSnackBar, MatSnackBarVerticalPosition, MatDialog } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { RecruitmentService } from 'src/app/services/firestore/Recruitment.service';
import { PlayerService } from 'src/app/services/firestore/player.service';
import { Recruitment, recruitmentState } from 'src/app/model/recruitment';
import { MinInfoPlayer } from 'src/app/model/player';
import { GameInProgress } from 'src/app/model/game';
import * as firebase from 'firebase';
import Swal from 'sweetalert2';
import { ChinKerDialogCreateNewComponent } from 'src/app/components-chinker/dialog-create-new/dialog-create-new.component';
import { ChinkerDialogManualComponent } from 'src/app/components-chinker/dialog-manual/dialog-manual.component';
import { ChinkerSetup } from 'src/app/components-chinker/model/chinker-setup';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})

export class PageHomeComponent implements OnInit {

  matGridSetup = {
    cols: 3,
    rowHeight: '350px',
    gutterSize: '0px',
    GamesInProgress: {
      cols: 3,
      rows: 1
    },
    JoinOrCreateGame: {
      cols: 3,
      rows: 1
    }
  };

  cards = [
    { title: 'Card 1', cols: 1, rows: 1 },
    { title: 'Card 2', cols: 1, rows: 1 },
    { title: 'Card 3', cols: 1, rows: 1 },
    { title: 'Card 4', cols: 3, rows: 1 }
  ];

  inSmallScreen: boolean;
  inMediumScreen: boolean;
  gamesInProgress: Observable<GameInProgress[]>;
  recruitments: Observable<Recruitment[]>;
  userlogined: firebase.User;

  constructor(public au: AngularFireAuth, private afsRecruitments: RecruitmentService,
    public afsPlayer: PlayerService,
    public breakpointObserver: BreakpointObserver, private translate: TranslateService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        this.inSmallScreen = state.matches;
        this.makeResponsive();
      });
    this.breakpointObserver
      .observe(['(max-width: 900px)'])
      .subscribe((state: BreakpointState) => {
        this.inMediumScreen = state.matches;
        this.makeResponsive();
      });

    this.au.authState.subscribe(user => {
      if (user) {
        this.userlogined = user;
        this.gamesInProgress = this.afsPlayer.getGamesInProgress(user).map(
          actions => {
            return actions.map(action => {
              const data = action.payload.doc.data() as GameInProgress;
              const id = action.payload.doc.id;
              return { id, ...data };
            });
          }
        );
      } else {
        this.userlogined = null;
        this.gamesInProgress = null;
      }
    });

    this.recruitments = this.afsRecruitments.getRecruitments().map(
      actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Recruitment;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      }
    );
  }

  makeResponsive(): void {
    if (this.inSmallScreen) {
      this.cards = [
        { title: 'Card 1', cols: 3, rows: 1 },
        { title: 'Card 2', cols: 3, rows: 1 },
        { title: 'Card 3', cols: 3, rows: 1 },
        { title: 'Card 4', cols: 3, rows: 1 }
      ];
    } else {
      if (this.inMediumScreen) {
        this.cards = [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 2, rows: 1 },
          { title: 'Card 3', cols: 2, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      } else {
        this.cards = [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 2 },
          { title: 'Card 4', cols: 2, rows: 1 }
        ];
      }




    }


  }

  showInfo(idGame: string) {
    switch (idGame) {
      case 'chinker':
        const dialogRef = this.dialog.open(ChinkerDialogManualComponent);
        break;

      default:
        break;
    }

  }

  createRecruitment(idGame: string) {
    if (this.userlogined) {
      switch (idGame) {
        case 'chinker':
          this.RecruitForChinker();
          break;

        default:
          break;
      }
    } else {
      this.ShowErrorMessage('xNo se puede ejecutar esta acción sin estar loginado');
    }
  }

  private RecruitForChinker() {
    const dialogRef = this.dialog.open(ChinKerDialogCreateNewComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const setup = <ChinkerSetup>result;
        const player1: MinInfoPlayer = { uid: this.userlogined.uid, displayName: this.userlogined.displayName };
        const arrayPlayers: Array<MinInfoPlayer> = [];
        arrayPlayers.push(player1);
        const newRecruitment: Recruitment = {
          gameType: 'chinker',
          name: setup.name,
          description: setup.description,
          dateCreation: firebase.firestore.FieldValue.serverTimestamp(),
          state: recruitmentState.OPEN,
          creator: player1,
          players: arrayPlayers,
          countPlayers: 1,
          maxPlayers: setup.numPlayers,
          config: {
            numCardsInHand: setup.numCardsInHand,
            numGamesOnTable: setup.numGamesOnTable,
            isBetsAllowed: setup.isBetsAllowed,
          }
        };
        this.afsRecruitments.createRecruitment(newRecruitment)
          .then((docRef) => {
            Swal({
              position: 'top',
              type: 'success',
              title: this.translate.instant('xHas creado un juego'),
              text: setup.name + ' ' + setup.description,
              showConfirmButton: false,
              timer: 2000
            });
            console.log('Document written with ID: ', docRef.id);
          })
          .catch(function (error) {
            this.ShowErrorMessage(error);
            console.error('Error adding document: ', error);
          });
      }
    });
  }

  canDelete(r: Recruitment): boolean {
    if (this.userlogined) {
      if (r.creator.uid === this.userlogined.uid) {
        return true;
      }
    }
    return false;
  }

  deleteRecruitment(r: Recruitment) {
    this.afsRecruitments.deleteRecruitment(r)
      .then(function () {
        this.ShowToastMessage('xGame delete.');
      })
      .catch(function (error) {
        this.ShowErrorMessage('xError deleting game.');
      });
  }

  canJoin(r: Recruitment): boolean {
    if (this.userlogined) {
      if (r.creator.uid !== this.userlogined.uid) {
        return true;
      }
      return false;
    }
    // -- Si no está loginado queremos que intente unirse para invitarlo
    return true;
  }

  joinRecruitment(r: Recruitment) {
    if (this.userlogined) {
      this.afsRecruitments.joinRecruitment(r, this.userlogined)
        .then(
          () => this.checkIfRoomReady(r),
          err => this.ShowToastMessage(err)
        )
        .catch(function (error) {
          console.error('Error editing document: ', error);
        });
    } else {
      this.ShowErrorMessage('xNo se puede ejecutar esta acción sin estar loginado');
    }
  }

  checkIfRoomReady(r: Recruitment) {
    console.log('hay un join game to r.name = ' + r.name);

    this.ShowToastMessage('xHeeeeyyy ' + this.userlogined.displayName + ' te has unido al juego');
    // Conditions for start the game. Simple. There are only 2 players.
    // Then... go. Start the game

    this.afsRecruitments.createGameFromThisRecruitment(r);

  }


  private ShowToastMessage(msg: string): void {
    Swal({
      toast: true,
      position: 'top',
      type: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 2000
    });
  }
  private ShowErrorMessage(msg: string): void {
    Swal({
      type: 'error',
      title: this.translate.instant('Error'),
      text: msg,
      showConfirmButton: true
    });
  }
}
