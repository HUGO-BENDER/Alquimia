import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { Recruitment, recruitmentState } from '../../model/recruitment';
import { MinInfoPlayer } from '../../model/player';
import { Game } from '../../model/game';

@Injectable({
  providedIn: 'root'
})

export class RecruitmentService {
  constructor(private afs: AngularFirestore) {
  }

  createRecruitment(newRecruitment: Recruitment): Promise<DocumentReference> {
    return this.afs.collection('Recruitments').add(newRecruitment);
  }

  public getRecruitments() {
    return this.afs.collection('Recruitments').snapshotChanges();
  }

  deleteRecruitment(r: Recruitment): Promise<void> {
    return this.afs.collection('Recruitments').doc(r.id).delete();
  }

  joinRecruitment(r: Recruitment, userlogined: firebase.User): any {
    const rgRef = this.afs.collection('Recruitments').doc(r.id).ref;
    return this.afs.firestore.runTransaction(
      transJoinGame => transJoinGame.get(rgRef).then(
        sfDoc => {
          if (sfDoc.data().state === recruitmentState.OPEN) {
            const player1: MinInfoPlayer = { uid: userlogined.uid, displayName: userlogined.displayName };
            let arrayPlayers: Array<MinInfoPlayer> = [];
            arrayPlayers = sfDoc.data().players;
            arrayPlayers.push(player1);
            const newCount: number = sfDoc.data().countPlayers + 1;
            if (sfDoc.data().countPlayers + 1 === sfDoc.data().maxPlayers) {
              transJoinGame.update(rgRef, { state: recruitmentState.CLOSED, countPlayers: newCount, players: arrayPlayers });
            } else {
              transJoinGame.update(rgRef, { countPlayers: newCount, players: arrayPlayers });
            }
          } else {
            return Promise.reject('Sorry! Too late.');
          }
        }
      )
    );
  }

  createGameFromThisRecruitment(r: Recruitment): any {
    const batch = this.afs.firestore.batch();
    const NewId = this.createId();
    const newGameRef = this.afs.collection('Games').doc(NewId).ref;

    const recruitRef = this.afs.collection('Recruitments').doc(r.id).ref;
    recruitRef.get().then( doc => {
      if (doc.exists) {
        const newGame: Game = { gameType: r.gameType };
        batch.set(newGameRef, newGame);

        doc.data().players.forEach(p => {
          console.log('entramos a los players del recruit !', p.uid, ' => ', p.displayName);
          // tslint:disable-next-line:prefer-const
          let newGamePlayerRef = this.afs.collection('Games').doc(NewId).collection('Players').doc(p.uid).ref;
          batch.set(newGamePlayerRef, { uid: p.uid, displayName: p.displayName });
        });

        // const rgRef = this.afs.collection('Recruitments').doc(r.id).ref;
        // batch.delete(rgRef);

        batch.commit().then(res => console.log('Batch completed!'), err => console.error(err));
      } else {
        console.log('No such document!');
      }
    }).catch(function (error) {
      console.log('Error getting document:', error);
    });
  }

  createId() {
    return this.afs.firestore.collection('_').doc().id;
  }

}
