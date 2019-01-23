import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinkerGameComponent } from './chinker-game.component';

describe('PageGameComponent', () => {
  let component: ChinkerGameComponent;
  let fixture: ComponentFixture<ChinkerGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChinkerGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinkerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
