import { TestBed, inject } from '@angular/core/testing';

import { SessionService } from './session.service';
import { HttpClientModule } from '@angular/common/http';

import { Session } from '../models/session';

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

  it('should build a session', inject([SessionService], (service: SessionService) => {
    let answers = new Map<string, Object>();
    answers.set("12345", {
      "A": 4,
      "B": 1,
      "D": 1,
      "correct": "B"
    });
    answers.set("12346", {
      "A": 4,
    });
    answers.set("12347", {
      "true": "10",
      "false": "2",
      "correct": "true"
    });
    answers.set("12348", {
      "A": 4,
      "BCD": 1,
      "D": 1,
      "AB": 10,
      "correct": "AD"
    });
    let now = new Date();
    let session = service.buildSession(answers, now, "lecture1234");
    let expected = new Session();
    expect(session.date).toEqual(now);
    expect(session.lectureId).toEqual("lecture1234");
    expect(session.answers).toEqual({
      "12345": {
        "A": 4,
        "B": 1,
        "D": 1,
        "correct": "B"
      },
      "12346": {
        "A": 4,
      },
      "12347": {
        "true": "10",
        "false": "2",
        "correct": "true"
      },
      "12348": {
        "A": 4,
        "BCD": 1,
        "D": 1,
        "AB": 10,
        "correct": "AD"
      }
    });
  }));
});
