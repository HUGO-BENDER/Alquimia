import { NgModule } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MatFormFieldModule, MatStepperModule, MatTabsModule, MatButtonModule, MatTooltipModule, MatToolbarModule, MatMenuModule, MatIconModule, MatListModule, MatDialogModule,
  MatSidenavModule, MatGridListModule, MatCardModule, MatExpansionModule, MatSnackBarModule } from '@angular/material';

  @NgModule({
    imports: [
      MatFormFieldModule,
      MatStepperModule,
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
      MatFormFieldModule,
      MatStepperModule,
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
