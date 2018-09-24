import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { Recruitment, recruitmentState, InfoPlayer } from '../../model/recruitment';

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

  deleteRecruitment(room: Recruitment): Promise<void> {
    return this.afs.collection('Recruitments').doc(room.id).delete();
  }

  joinRecruitment(room: Recruitment, userlogined: firebase.User): any {
    const rgRef = this.afs.collection('Recruitments').doc(room.id).ref;
    return this.afs.firestore.runTransaction(
      transJoinGame => transJoinGame.get(rgRef).then(
        sfDoc => {
          if (sfDoc.data().state === recruitmentState.OPEN) {
            const player1: InfoPlayer = {uid: userlogined.uid, displayName: userlogined.displayName };
            let arrayPlayers: Array<InfoPlayer> = [];
            arrayPlayers = sfDoc.data().players;
            arrayPlayers.push(player1);
            const newCount: number = sfDoc.data().countPlayers + 1;
            if (sfDoc.data().countPlayers + 1 === sfDoc.data().maxPlayers) {
              transJoinGame.update(rgRef, {state: recruitmentState.CLOSED, countPlayers: newCount, players: arrayPlayers});
            } else {
              transJoinGame.update(rgRef, {countPlayers: newCount, players: arrayPlayers});
            }
          } else {
            return Promise.reject('Sorry! Too late.');
          }
        }
      )
    );
  }

  createGameFromThisRoom(r: Recruitment): any {
    const batch = this.afs.firestore.batch();

    const newGameRef = this.afs.collection('Game').doc(this.createId()).ref;

    const newGame = { name: 'Este es el nuevo juego' };
    batch.set(newGameRef, newGame);

    const rgRef = this.afs.collection('Recruitments').doc(r.id).ref;
    batch.delete(rgRef);

    batch.commit().then(res => console.log('Batch completed!'), err => console.error(err));
  }

  createId() {
    return this.afs.firestore.collection('_').doc().id;
  }

}
