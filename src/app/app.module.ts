// --Modulos en angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { Http } from '@angular/http';

// --Material
import { AppMaterialModule } from './components/app-material/app-material.module';

// --Translate
import { TranslateModule, TranslateLoader, TranslateStaticLoader, MissingTranslationHandler } from 'ng2-translate';
import { MissingTranslation } from './i18n/missing-translation';

// --componentes
import { AppComponent } from './app.component';
import { AppToolBarComponent } from './components/app-tool-bar/app-tool-bar.component';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'src/app/i18n', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AppToolBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppMaterialModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  providers:  [
    { provide: MissingTranslationHandler, useClass: MissingTranslation}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
