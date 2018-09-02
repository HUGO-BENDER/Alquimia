import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePolicyPrivacyComponent } from './page-policy-privacy.component';

describe('PagePolicyPrivacyComponent', () => {
  let component: PagePolicyPrivacyComponent;
  let fixture: ComponentFixture<PagePolicyPrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagePolicyPrivacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePolicyPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
