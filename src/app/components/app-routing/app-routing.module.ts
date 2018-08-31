import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageHomeComponent } from '../page-home/page-home.component';
import { PageAboutComponent } from '../page-about/page-about.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { PageGameComponent } from '../page-game/page-game.component';

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
