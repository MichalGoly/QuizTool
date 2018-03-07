import { Injectable } from '@angular/core';
import { Slide } from '../models/slide';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SlideService {

  constructor(private http: HttpClient) { }

  getByLectureId(_id: string) {
    return this.http.get<Slide>('express/slides/' + _id);
  }

}
