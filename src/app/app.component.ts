import { Component } from '@angular/core';
import {TranslateService} from 'ng2-translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'fr', 'ca', 'es']);
    translate.setDefaultLang('es');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|ca|es/) ? browserLang : 'en');
  }

}
