import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { TranslateService } from 'ng2-translate';
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
    this.dialogRef.close();
  }


}
