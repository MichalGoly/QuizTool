import { TestBed, inject } from '@angular/core/testing';

import { LecturerService } from './lecturer.service';
import { HttpClientModule } from '@angular/common/http';

describe('LecturerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [LecturerService]
    });
  });

  it('should be created', inject([LecturerService], (service: LecturerService) => {
    expect(service).toBeTruthy();
  }));
});
