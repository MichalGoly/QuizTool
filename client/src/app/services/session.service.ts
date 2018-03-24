import { Injectable } from '@angular/core';
import { Session } from '../models/session';
import { HttpClient } from '@angular/common/http';

const ENDPOINT = 'express/sessions/';

@Injectable()
export class SessionService {

  constructor(private http: HttpClient) { }

  newSession(session: Session) {
    return this.http.post<any>(ENDPOINT, session);
  }

  getByLectureId(_id: string) {
    return this.http.get<Session[]>(ENDPOINT + _id);
  }

  buildSession(_answers: Map<string, Object>, _date: Date, _lectureId: string): Session {
    if (_answers !== null && _answers.size > 0) {
      let ans = {};
      _answers.forEach((value, key) => {
        ans[key] = value;
      });
      let session = new Session();
      session.lectureId = _lectureId;
      session.date = _date;
      session.answers = ans;
      return session;
    } else {
      throw new TypeError("Parameter _answers was null or the map was empty");
    }
  }

}
