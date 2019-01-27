// --Modulos en angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './components/app-routing/app-routing.module';
import { Http } from '@angular/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';

// --Material
import { AppMaterialModule } from './components/app-material/app-material.module';

// --SweetAlert2
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

// --Translate
import { TranslateModule, TranslateLoader, TranslateStaticLoader, MissingTranslationHandler } from 'ng2-translate';
import { MissingTranslation } from './i18n/missing-translation';

// --Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

// --Firebase UI
import { FirebaseUIModule } from 'firebaseui-angular';
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';

// --Services
import { MetadataService } from './services/firestore/metadata.service';
import { SidenavService } from './services/components/sidenav.service';

// --componentes
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppToolBarComponent } from './components/app-tool-bar/app-tool-bar.component';
import { PageHomeComponent } from './components/page-home/page-home.component';
import { PageAboutComponent } from './components/page-about/page-about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppLoginComponent } from './components/app-login/app-login.component';
import { PagePolicyPrivacyComponent } from './components/page-policy-privacy/page-policy-privacy.component';
import { PageServiceConditionsComponent } from './components/page-service-conditions/page-service-conditions.component';

// --Chinker-components
import { ChinkerGameComponent } from './components-chinker/chinker-game/chinker-game.component';
import { ChinkerDialogManualComponent } from './components-chinker/dialog-manual/dialog-manual.component';
import { ChinKerDialogCreateNewComponent } from './components-chinker/dialog-create-new/dialog-create-new.component';

// -- directives
import { FramepanzoomDirective } from './components/app-framepanzoom/framepanzoom.directive';



const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [
        'https://www.googleapis.com/auth/plus.login'
      ],
      customParameters: {
        prompt: 'select_account'
      }
    },
    {
      scopes: [
        'public_profile',
        'email'
      ],
      customParameters: {
        'auth_type': 'reauthenticate'
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    },
    firebase.auth.EmailAuthProvider.PROVIDER_ID
    // -- Importante! estudiar lo usuario anonimo
    // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  tosUrl: '/serviceconditions',
  privacyPolicyUrl: '/policyprivacy',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    AppToolBarComponent,
    PageHomeComponent,
    PageAboutComponent,
    PageNotFoundComponent,
    AppFooterComponent,
    AppLoginComponent,
    PagePolicyPrivacyComponent,
    PageServiceConditionsComponent,
    FramepanzoomDirective,
    ChinkerGameComponent,
    ChinKerDialogCreateNewComponent,
    ChinkerDialogManualComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppMaterialModule,
    DragDropModule,
    LayoutModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      confirmButtonClass: 'mat-raised-button mat-primary',
      cancelButtonClass: 'mat-raised-button swal-margin-rigth',
      reverseButtons: true
  }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  entryComponents: [
    AppLoginComponent,
    ChinKerDialogCreateNewComponent,
    ChinkerDialogManualComponent
  ],
  providers:  [ MetadataService, SidenavService,
    { provide: MissingTranslationHandler, useClass: MissingTranslation}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
