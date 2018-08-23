import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './app-tool-bar.component.html',
  styleUrls: ['./app-tool-bar.component.scss']
})
export class AppToolBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openDialogLogin(): void {
    alert('Login');
  };

  logout() {
    if (confirm("Está seguro de querer abandonar la aplicación")) {
      alert('Adios');
    }
  }

}
