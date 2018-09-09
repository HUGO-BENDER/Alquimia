import { Component, ViewChild, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { SidenavService } from './services/components/sidenav.service';
import { MatSidenav } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('appsidenav') public sidenav: MatSidenav;
  currentUrl: string;

  constructor( private router: Router, private translate: TranslateService, private sidenavService: SidenavService) {
    this.translate.addLangs(['en', 'fr', 'ca', 'es']);
    this.translate.setDefaultLang('es');

    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang.match(/en|fr|ca|es/) ? browserLang : 'en');

    router.events.subscribe((_: NavigationEnd) => {
      if (_.url) {
      this.currentUrl = _.url;
      }
    });
  }

  ngOnInit() {
    this.sidenavService.setSidenav(this.sidenav);
    this.sidenavService.setPositionLeft();
  }

}
