import { NgModule } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatToolbarModule, MatMenuModule, MatIconModule, MatListModule, MatDialogModule,
  MatSidenavModule, MatGridListModule, MatCardModule } from '@angular/material';

  @NgModule({
    imports: [
      MatButtonModule,
      MatToolbarModule,
      MatMenuModule,
      MatIconModule,
      MatListModule,
      MatDialogModule,
      MatSidenavModule,
      MatGridListModule,
      MatCardModule
    ],
    exports: [
      MatButtonModule,
      MatToolbarModule,
      MatMenuModule,
      MatIconModule,
      MatListModule,
      MatDialogModule,
      MatSidenavModule,
      MatGridListModule,
      MatCardModule
    ],
    declarations: []
  })
  export class AppMaterialModule {}
