// --Modulos en angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './components/app-routing/app-routing.module';
import { Http } from '@angular/http';

// --Material
import { AppMaterialModule } from './components/app-material/app-material.module';

// --Translate
import { TranslateModule, TranslateLoader, TranslateStaticLoader, MissingTranslationHandler } from 'ng2-translate';
import { MissingTranslation } from './i18n/missing-translation';

// --Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

// --Firebase UI
import { AuthMethods, AuthProvider, AuthProviderWithCustomConfig, FirebaseUIAuthConfig, FirebaseUIModule, CredentialHelper } from 'firebaseui-angular';
import { AngularFireAuthModule } from 'angularfire2/auth';

// --Services
import { MetadataService } from './services/metadata.service';
import { SidenavService } from './services/sidenav.service';

// --componentes
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppToolBarComponent } from './components/app-tool-bar/app-tool-bar.component';
import { PageHomeComponent } from './components/page-home/page-home.component';
import { PageAboutComponent } from './components/page-about/page-about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageGameComponent } from './components/page-game/page-game.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppLoginComponent } from './components/app-login/app-login.component';
import { PagePolicyPrivacyComponent } from './components/page-policy-privacy/page-policy-privacy.component';
import { PageServiceConditionsComponent } from './components/page-service-conditions/page-service-conditions.component';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'src/app/i18n', '.json');
}

const facebookCustomConfig: AuthProviderWithCustomConfig = {
  provider: AuthProvider.Facebook,
  customConfig: {
    scopes: [
      'public_profile',
      'email'
    ],
    customParameters: {
      // Forces password re-entry.
      auth_type: 'reauthenticate'
    }
  }
};
const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProvider.Google,
    facebookCustomConfig,
    // AuthProvider.Twitter,
    // AuthProvider.Github,
    AuthProvider.Password
  ],
  method: AuthMethods.Popup,
  tos: '<your-tos-link>',
  credentialHelper: CredentialHelper.None
};

@NgModule({
  declarations: [
    AppComponent,
    AppToolBarComponent,
    PageHomeComponent,
    PageAboutComponent,
    PageNotFoundComponent,
    PageGameComponent,
    AppFooterComponent,
    AppLoginComponent,
    PagePolicyPrivacyComponent,
    PageServiceConditionsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppMaterialModule,
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
    AppLoginComponent
  ],
  providers:  [ MetadataService, SidenavService,
    { provide: MissingTranslationHandler, useClass: MissingTranslation}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
