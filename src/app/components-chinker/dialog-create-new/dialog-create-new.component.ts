import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'chinker-dialog-create-new',
  templateUrl: './dialog-create-new.component.html',
  styleUrls: ['./dialog-create-new.component.scss']
})

export class ChinKerDialogCreateNewComponent {

  firstFormGroup = this.fb.group({
    name: [null, Validators.required],
    description: null
  });

  secondFormGroup = this.fb.group({
    numPlayers: [2, Validators.compose([Validators.required, Validators.min(2), Validators.max(2)])],
    numCardsInHand: [6, Validators.compose([Validators.required, Validators.min(5), Validators.max(7)])],
    numGamesOnTable: [9, Validators.compose([Validators.required, Validators.min(5), Validators.max(9)])],
    isBetsAllowed: [true]
  });

  constructor(
    private dialogRef: MatDialogRef<ChinKerDialogCreateNewComponent>,
    private fb: FormBuilder) { }


  onSubmit() {
    alert('Thanks!');
    this.dialogRef.close();
  }

  close() {
    alert('cerramos!');
    this.dialogRef.close();
  }
}
