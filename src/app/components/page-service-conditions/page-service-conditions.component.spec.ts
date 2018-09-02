import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageServiceConditionsComponent } from './page-service-conditions.component';

describe('PageServiceConditionsComponent', () => {
  let component: PageServiceConditionsComponent;
  let fixture: ComponentFixture<PageServiceConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageServiceConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageServiceConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
