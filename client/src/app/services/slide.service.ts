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

  bulkUpdateQuiz(slides: Slide[]) {
    let out = [];
    for (let i = 0; i < slides.length; i++) {
      out.push({
        _id: slides[i]._id,
        isQuiz: slides[i].isQuiz
      });
    }
    return this.http.put<any>(ENDPOINT, out);
  }

}
