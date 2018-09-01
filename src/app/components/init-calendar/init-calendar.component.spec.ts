import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitCalendarComponent } from './init-calendar.component';

describe('InitCalendarComponent', () => {
  let component: InitCalendarComponent;
  let fixture: ComponentFixture<InitCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
