import { TestBed, inject } from '@angular/core/testing';

import { CalendarService } from './calendar-service.service';

describe('CalendarServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarService]
    });
  });

  it('should be created', inject([CalendarService], (service: CalendarService) => {
    expect(service).toBeTruthy();
  }));
});
