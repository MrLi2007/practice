import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSchedulerComponent } from './resource-scheduler.component';

describe('TimesheetEntryComponent', () => {
  let component: ResourceSchedulerComponent;
  let fixture: ComponentFixture<ResourceSchedulerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceSchedulerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
