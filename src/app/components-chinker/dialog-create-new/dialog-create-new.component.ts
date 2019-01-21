import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'chinker-dialog-create-new',
  templateUrl: './dialog-create-new.component.html',
  styleUrls: ['./dialog-create-new.component.scss']
})
export class ChinKerDialogCreateNewComponent implements OnInit {

  idGame: string;

  constructor(
    private dialogRef: MatDialogRef<ChinKerDialogCreateNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {

  }



  ngOnInit() {
    this.idGame = this.data.idGame;
  }


  save() {
    this.dialogRef.close('save');
  }

  close() {
    this.dialogRef.close();
  }


}
