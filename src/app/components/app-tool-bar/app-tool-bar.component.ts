import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TranslateService } from 'ng2-translate';
import { SidenavService } from '../../services/components/sidenav.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AppLoginComponent } from './../app-login/app-login.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './app-tool-bar.component.html',
  styleUrls: ['./app-tool-bar.component.scss']
})
export class AppToolBarComponent implements OnInit {
  currentUrl: string;
  user: Observable<firebase.User>;
  dialogRef: MatDialogRef<AppLoginComponent>;
  inSmallScreen: boolean;

  constructor(private translate: TranslateService, public breakpointObserver: BreakpointObserver,
    private sidenavService: SidenavService,
    public dialog: MatDialog, public au: AngularFireAuth) {
  }

  ngOnInit() {
    this.user = this.au.authState;
    this.breakpointObserver
      .observe(['(min-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        this.inSmallScreen = !state.matches;
        if (state.matches) {
          console.log('Viewport is 600px or over!');
        } else {
          console.log('Viewport is getting smaller!');
        }
      });
  }

  // changeLanguage(lang) {
  //   this.translate.use(lang);
  // }

  openDialogLogin(): void {
    this.dialogRef = this.dialog.open(AppLoginComponent);
  }

  logout() {
    if (confirm(this.translate.instant('App.messageLogout'))) {
      this.au.auth.signOut();
    }
  }

  toggleAppSidenav() {
    this.sidenavService.toggle();
  }


}
