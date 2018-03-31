import { TestBed, inject } from '@angular/core/testing';

import { LectureService } from './lecture.service';
import { HttpClientModule } from '@angular/common/http';

describe('LectureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [LectureService]
    });
  });

  it('should be created', inject([LectureService], (service: LectureService) => {
    expect(service).toBeTruthy();
  }));
});
