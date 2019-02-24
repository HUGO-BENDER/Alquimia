import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TranslateService } from 'ng2-translate';
import { SidenavService } from '../../services/components/sidenav.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AppLoginComponent } from './../app-login/app-login.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import Swal from 'sweetalert2';

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
    this.au.authState.subscribe(user => {
      if (user && this.dialogRef) {
        this.dialogRef.close();
        console.log('Por las dudas cerramos 2 veces');
      }
    });
    this.breakpointObserver
      .observe(['(min-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        this.inSmallScreen = !state.matches;
      });
  }

  openDialogLogin(): void {
    this.dialogRef = this.dialog.open(AppLoginComponent);
  }

  logout() {
    this.au.auth.signOut().then( () => this.CloseSessionMessage());
  }

  private CloseSessionMessage(): void {
    Swal({
      toast: true,
      position: 'top',
      type: 'success',
      title: this.translate.instant('App.Msg.CloseSession'),
      showConfirmButton: false,
      timer: 1000
    });
  }

  toggleAppSidenav() {
    this.sidenavService.toggle();
  }


}
