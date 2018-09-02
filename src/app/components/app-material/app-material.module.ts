import { NgModule } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatTooltipModule, MatToolbarModule, MatMenuModule, MatIconModule, MatListModule, MatDialogModule,
  MatSidenavModule, MatGridListModule, MatCardModule, } from '@angular/material';

  @NgModule({
    imports: [
      MatButtonModule,
      MatTooltipModule, 
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
      MatTooltipModule, 
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
