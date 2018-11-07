import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageHomeComponent } from '../page-home/page-home.component';
import { PageAboutComponent } from '../page-about/page-about.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { PageGameComponent } from '../page-game/page-game.component';
import { PagePolicyPrivacyComponent } from '../page-policy-privacy/page-policy-privacy.component';
import { PageServiceConditionsComponent } from '../page-service-conditions/page-service-conditions.component';

const routes: Routes = [
  {
    path: '',
    component: PageHomeComponent
  }, {
    path: 'home',
    component: PageHomeComponent
  },
  {
    path: 'game/:id',
    component: PageGameComponent
  },
  {
    path: 'about',
    component: PageAboutComponent
  }, {
    path: 'policyprivacy',
    component: PagePolicyPrivacyComponent
  }, {
    path: 'serviceconditions',
    component: PageServiceConditionsComponent
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
