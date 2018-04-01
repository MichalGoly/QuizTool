import { TestBed, inject } from '@angular/core/testing';

import { SlideService } from './slide.service';
import { HttpClientModule } from '@angular/common/http';

describe('SlideService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SlideService]
    });
  });

  it('should be created', inject([SlideService], (service: SlideService) => {
    expect(service).toBeTruthy();
  }));
});
