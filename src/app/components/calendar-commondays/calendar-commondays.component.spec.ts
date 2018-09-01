import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCommondaysComponent } from './calendar-commondays.component';

describe('CalendarCommondaysComponent', () => {
  let component: CalendarCommondaysComponent;
  let fixture: ComponentFixture<CalendarCommondaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarCommondaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarCommondaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
