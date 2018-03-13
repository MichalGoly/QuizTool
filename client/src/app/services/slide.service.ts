import { Injectable } from '@angular/core';
import { Slide } from '../models/slide';
import { HttpClient } from '@angular/common/http';

const ENDPOINT = 'express/slides/';

@Injectable()
export class SlideService {

  constructor(private http: HttpClient) { }

  getByLectureId(_id: string) {
    return this.http.get<Slide[]>(ENDPOINT + _id);
  }

}
