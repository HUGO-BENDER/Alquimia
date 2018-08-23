//--Modulos en angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
//--Material
import { AppMaterialModule } from './components/app-material/app-material.module';
//--componentes
import { AppComponent } from './app.component';
import { AppToolBarComponent } from './components/app-tool-bar/app-tool-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    AppToolBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
