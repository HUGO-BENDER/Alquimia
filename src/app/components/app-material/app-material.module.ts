import { NgModule } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatTooltipModule, MatToolbarModule, MatMenuModule, MatIconModule, MatListModule, MatDialogModule,
  MatSidenavModule, MatGridListModule, MatCardModule, MatExpansionModule } from '@angular/material';

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
      MatCardModule,
      MatExpansionModule
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
      MatCardModule,
      MatExpansionModule
    ],
    declarations: []
  })
  export class AppMaterialModule {}
