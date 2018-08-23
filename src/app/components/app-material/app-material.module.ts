import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule, MatMenuModule, MatIconModule, MatListModule, MatDialogModule, MatSidenavModule } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatDialogModule, 
    MatSidenavModule
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatDialogModule, 
    MatSidenavModule
  ],
  declarations: []
})
export class AppMaterialModule { }