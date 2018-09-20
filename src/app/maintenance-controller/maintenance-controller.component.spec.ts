import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceControllerComponent } from './maintenance-controller.component';

describe('MaintenanceControllerComponent', () => {
  let component: MaintenanceControllerComponent;
  let fixture: ComponentFixture<MaintenanceControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
