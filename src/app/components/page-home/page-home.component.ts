import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { RecruitmentService } from '../../services/firestore/Recruitment.service';
import { Recruitment, recruitmentState } from '../../model/recruitment';
import { MinInfoPlayer } from '../../model/player';
import * as firebase from 'firebase';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {

  cards = [
    // { title: 'Card 1', cols: 2, rows: 1 },
    // { title: 'Card 2', cols: 1, rows: 2 },
    { title: 'Card 3', cols: 1, rows: 1 },
    { title: 'Card 4', cols: 1, rows: 1 }
  ];

  recruitments: Observable<Recruitment[]>;
  userlogined: firebase.User;
  snackBarVerticalPositionTop: MatSnackBarVerticalPosition = 'top';

  constructor(public au: AngularFireAuth, private afsRecruitments: RecruitmentService, public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.au.authState.subscribe(user => {
      if (user) {
        this.userlogined = user;
      } else {
        this.userlogined = null;
      }
    });

    this.recruitments = this.afsRecruitments.getRecruitments().map(
      actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Recruitment;
          const id = action.payload.doc.id;
          console.log('volvimos ');
          return { id, ...data };
        });
      }
    );
  }

  createRecruitment(idGame: string) {
    if (this.userlogined) {
      const player1: MinInfoPlayer = { uid: this.userlogined.uid, displayName: this.userlogined.displayName };
      const arrayPlayers: Array<MinInfoPlayer> = [];
      arrayPlayers.push(player1);

      const newRecruitment: Recruitment = {
        gameId: idGame,
        dateCreation: firebase.firestore.FieldValue.serverTimestamp(),
        state: recruitmentState.OPEN,
        creator: player1,
        players: arrayPlayers,
        countPlayers: 1,
        maxPlayers: 2
      };
      this.afsRecruitments.createRecruitment(newRecruitment)
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
        this.openSnackBar('xGame delete.');
      })
      .catch(function (error) {
        this.openSnackBar('xError deleting game.');
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
          err => this.openSnackBar(err)
        )
        .catch(function (error) {
          console.error('Error editing document: ', error);
        });
    } else {
      this.openSnackBar('xNo se puede ejecutar esta acción sin estar loginado');
    }
  }

  checkIfRoomReady(r: Recruitment) {
    console.log('r.state = ' + r.state);


    this.openSnackBar('xHeeeeyyy ' + this.userlogined.displayName  + ' te has unido al juego');
    // Conditions for start the game. Simple. There are only 2 players.
    // Then... go. Start the game
   

   // this.afsRecruitments.createGameFromThisRecruitment(r);

  }


  openSnackBar(mensaje: string): any {
    this.snackBar.open(mensaje, 'xClose', {
      duration: 5000,
      verticalPosition: this.snackBarVerticalPositionTop
    });
  }

}
