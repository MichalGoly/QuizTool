import { Injectable } from '@angular/core';
import { Lecture } from '../models/lecture';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LectureService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Lecture[]>('express/lectures');
  }

  getById(_id: string) {
    return this.http.get<Lecture>('express/lectures/' + _id);
  }

  getFile(_id: string) {
    // TODO
    return null;
  }

  delete(_id: string) {
    return this.http.delete('express/lectures/' + _id);
  }
}
