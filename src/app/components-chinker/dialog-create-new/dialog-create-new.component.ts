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

  // newChinkerRecruitment = this.fb.group({
  //   company: null,
  //   firstName: [null, Validators.required],
  //   lastName: [null, Validators.required],
  //   address: [null, Validators.required],
  //   address2: null,
  //   city: [null, Validators.required],
  //   state: [null, Validators.required],
  //   postalCode: [null, Validators.compose([
  //     Validators.required, Validators.minLength(5), Validators.maxLength(5)])
  //   ],
  //   shipping: ['free', Validators.required]
  // });

  firstFormGroup = this.fb.group({
    name: [null, Validators.required],
    description: null
  });

  secondFormGroup = this.fb.group({
    secondCtrl: [null, Validators.required]
  });




  constructor(
    private dialogRef: MatDialogRef<ChinKerDialogCreateNewComponent>,
    private fb: FormBuilder) { }


  onSubmit() {
    alert('Thanks!');
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
