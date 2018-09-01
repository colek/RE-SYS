import { TestBed, inject } from '@angular/core/testing';

import { ReasonService } from './reason.service';

describe('ReasonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReasonService]
    });
  });

  it('should be created', inject([ReasonService], (service: ReasonService) => {
    expect(service).toBeTruthy();
  }));
});
