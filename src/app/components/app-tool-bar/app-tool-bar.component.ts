import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { SidenavService } from '../../services/sidenav.service' ;

@Component({
  selector: 'app-tool-bar',
  templateUrl: './app-tool-bar.component.html',
  styleUrls: ['./app-tool-bar.component.scss']
})
export class AppToolBarComponent implements OnInit {
  currentUrl: string;

  constructor(private translate: TranslateService, private sidenavService: SidenavService) {
  }

  ngOnInit() {
  }

  changeLanguage(lang) {
    this.translate.use(lang);
  }

  openDialogLogin(): void {
    alert('Login');
  }

  logout() {
    if (confirm('"Está seguro de querer abandonar la aplicación')) {
      alert('Adios');
    }
  }

  toggleAppSidenav() {
    this.sidenavService.toggle();
  }


}
