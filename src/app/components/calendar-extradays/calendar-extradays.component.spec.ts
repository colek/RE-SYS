import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarExtradaysComponent } from './calendar-extradays.component';

describe('CalendarExtradaysComponent', () => {
  let component: CalendarExtradaysComponent;
  let fixture: ComponentFixture<CalendarExtradaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarExtradaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarExtradaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
