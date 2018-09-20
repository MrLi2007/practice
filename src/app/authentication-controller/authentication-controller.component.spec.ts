import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationControllerComponent } from './authentication-controller.component';

describe('AuthenticationControllerComponent', () => {
  let component: AuthenticationControllerComponent;
  let fixture: ComponentFixture<AuthenticationControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
