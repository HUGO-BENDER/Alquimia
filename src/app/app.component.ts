import { Component, ViewChild, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { SidenavService } from './services/components/sidenav.service';
import { MatSidenav, MatListOption } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('appsidenav') public sidenav: MatSidenav;

  currentUrl: string;
  showMenuLanguage = false;
  actualLang: string;
  listLanguages = [
    { id: 'en', name: 'English' },
    { id: 'fr', name: 'French' },
    { id: 'ca', name: 'Catalan' },
    { id: 'es', name: 'Spanish' }
  ];

  constructor(router: Router, private translate: TranslateService, private sidenavService: SidenavService) {
    this.translate.addLangs(this.listLanguages.map(l => l.id));
    this.translate.setDefaultLang('es');

    const browserLang = this.translate.getBrowserLang();
    this.actualLang = browserLang.match(/en|fr|ca|es/) ? browserLang : 'en';
    this.translate.use(this.actualLang);

    router.events.subscribe((_: NavigationEnd) => {
      if (_.url) {
        if (_.url.lastIndexOf('/') > 0) {
          this.currentUrl = _.url.substring(0, _.url.lastIndexOf('/'));
        } else {
          this.currentUrl = _.url;
        }
      }
    });
  }

  ngOnInit() {
    this.sidenavService.setSidenav(this.sidenav);
    this.sidenavService.setPositionLeft();
  }

  changeLanguage(lang: string) {
    this.actualLang = lang;
    this.translate.use(lang);
  }

  toggleMenu() {
    this.showMenuLanguage = !this.showMenuLanguage;
    // setTimeout(() => this.navcontainer._updateContentMargins());
  }
}
