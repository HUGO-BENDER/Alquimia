import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageHomeComponent } from './components/page-home/page-home.component';
import { PageAboutComponent } from './components/page-about/page-about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageGameComponent } from './components/page-game/page-game.component';

const routes: Routes = [
  {
    path: '',
    component: PageHomeComponent
  }, {
    path: 'home',
    component: PageHomeComponent
  },
  {
    path: 'game',
    component: PageGameComponent
  },
  {
    path: 'about',
    component: PageAboutComponent
  }, {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      enableTracing: true
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
