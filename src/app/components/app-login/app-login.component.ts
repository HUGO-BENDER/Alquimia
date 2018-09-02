import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FirebaseUISignInSuccess } from 'firebaseui-angular';

@Component({
  selector: 'app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss']
})
export class AppLoginComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AppLoginComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
 
  successCallback(signInSuccessData: FirebaseUISignInSuccess) {
    this.dialogRef.close();
  } 


}
