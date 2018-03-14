import { Injectable } from '@angular/core';
import { Lecture } from '../models/lecture';
import { HttpClient } from '@angular/common/http';

const ENDPOINT = 'express/lectures/';

@Injectable()
export class LectureService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Lecture[]>(ENDPOINT);
  }

  getById(_id: string) {
    return this.http.get<Lecture>(ENDPOINT + _id);
  }

  getFile(_id: string) {
    // TODO
    return null;
  }

  delete(_id: string) {
    return this.http.delete(ENDPOINT + _id);
  }
}
