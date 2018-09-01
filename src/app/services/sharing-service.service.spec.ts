import { TestBed, inject } from '@angular/core/testing';

import { SharingService } from './sharing-service.service';

describe('SharingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharingService]
    });
  });

  it('should be created', inject([SharingService], (service: SharingService) => {
    expect(service).toBeTruthy();
  }));
});
