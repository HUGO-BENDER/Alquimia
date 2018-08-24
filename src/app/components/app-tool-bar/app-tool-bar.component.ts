import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './app-tool-bar.component.html',
  styleUrls: ['./app-tool-bar.component.scss']
})
export class AppToolBarComponent implements OnInit {

  constructor(private translate: TranslateService) {

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

}
