import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'chinker-dialog-create-new',
  templateUrl: './dialog-create-new.component.html',
  styleUrls: ['./dialog-create-new.component.scss']
})
export class ChinKerDialogCreateNewComponent  {

  constructor( private dialogRef: MatDialogRef<ChinKerDialogCreateNewComponent>) { }

  close() {
    this.dialogRef.close();
  }


}
