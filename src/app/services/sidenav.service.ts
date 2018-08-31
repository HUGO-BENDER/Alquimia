import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenav: MatSidenav;
  constructor() { }

  setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  open() {
    return this.sidenav.open();
  }


  close() {
    return this.sidenav.close();
  }

  toggle(): void {
    this.sidenav.toggle();
  }

  setPositionLeft(): void {
    this.sidenav.position = 'start';
  }

  setPositionRigth(): void {
    this.sidenav.position = 'end';
  }

}
