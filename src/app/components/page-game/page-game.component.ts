import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GameService } from 'src/app/services/firestore/game.service';
import { Game } from 'src/app/model/game';
import * as firebase from 'firebase';

@Component({
  selector: 'app-page-game',
  templateUrl: './page-game.component.html',
  styleUrls: ['./page-game.component.scss']
})
export class PageGameComponent implements OnInit {

  currentGame: any;
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

      } else {
        this.userlogined = null;
      }
    });

    this.afsGame.getGame(idGame).get().then( doc => {
      console.log('------------- afsGame.getGame(idGame) ---');
      console.log(doc);
      this.currentGame = doc.data();
    }
  ).catch(function(error) {
    console.log('Error getting document:', error);
});

    console.log('------------- this.currentGame ---');
    console.log(this.currentGame);
  }




}
