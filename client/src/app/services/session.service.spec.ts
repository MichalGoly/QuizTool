import { TestBed, inject } from '@angular/core/testing';

import { SessionService } from './session.service';
import { HttpClientModule } from '@angular/common/http';

describe('SessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SessionService]
    });
  });

  it('should be created', inject([SessionService], (service: SessionService) => {
    expect(service).toBeTruthy();
  }));
});
