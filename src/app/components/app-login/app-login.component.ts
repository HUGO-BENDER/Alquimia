import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import Swal from 'sweetalert2';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';


@Component({
  selector: 'app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})
export class AppLoginComponent implements OnInit {

  constructor(private translate: TranslateService, public dialogRef: MatDialogRef<AppLoginComponent>) { }

  ngOnInit() {
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log('login con errorCallback', errorData);
    this.dialogRef.close();
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    console.log('login con exito successCallback', signInSuccessData);
    this.ShowToastMessage(this.translate.instant('Bienvenido ') + signInSuccessData.authResult.user.displayName);
    this.dialogRef.close();
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

}
