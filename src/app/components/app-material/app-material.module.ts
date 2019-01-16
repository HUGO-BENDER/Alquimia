import { NgModule } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MatTabsModule, MatButtonModule, MatTooltipModule, MatToolbarModule, MatMenuModule, MatIconModule, MatListModule, MatDialogModule,
  MatSidenavModule, MatGridListModule, MatCardModule, MatExpansionModule, MatSnackBarModule } from '@angular/material';

  @NgModule({
    imports: [
      MatTabsModule,
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
      MatExpansionModule,
      MatSnackBarModule
    ],
    exports: [
      MatTabsModule,
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
      MatExpansionModule,
      MatSnackBarModule
    ],
    declarations: []
  })
  export class AppMaterialModule {}
