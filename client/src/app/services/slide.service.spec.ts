import { TestBed, inject } from '@angular/core/testing';

import { SlideService } from './slide.service';

describe('SlideService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SlideService]
    });
  });

  it('should be created', inject([SlideService], (service: SlideService) => {
    expect(service).toBeTruthy();
  }));
});
