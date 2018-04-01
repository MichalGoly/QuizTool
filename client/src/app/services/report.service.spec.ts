import { TestBed, inject } from '@angular/core/testing';
import { DatePipe } from '@angular/common';

import { ReportService } from './report.service';
import { SlideService } from './slide.service';
import { HttpClientModule } from '@angular/common/http';

describe('ReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ReportService, SlideService, DatePipe]
    });
  });

  it('should be created', inject([ReportService], (service: ReportService) => {
    expect(service).toBeTruthy();
  }));
});
