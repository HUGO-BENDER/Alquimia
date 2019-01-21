import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinKerDialogCreateNewComponent } from './dialog-create-new.component';

describe('DialogCreateNewComponent', () => {
  let component: ChinKerDialogCreateNewComponent;
  let fixture: ComponentFixture<ChinKerDialogCreateNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChinKerDialogCreateNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinKerDialogCreateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
