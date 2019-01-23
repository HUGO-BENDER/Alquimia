import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinkerDialogManualComponent } from './dialog-manual.component';

describe('DialogManualComponent', () => {
  let component: ChinkerDialogManualComponent;
  let fixture: ComponentFixture<ChinkerDialogManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChinkerDialogManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinkerDialogManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
