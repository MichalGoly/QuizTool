import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as io from 'socket.io-client';

import { AnswerComponent } from './answer.component';
import { QuizService } from '../../../services/quiz.service';

describe('AnswerComponent', () => {
  let component: AnswerComponent;
  let fixture: ComponentFixture<AnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnswerComponent],
      providers: [
        { provide: QuizService, useClass: QuizService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerComponent);
    component = fixture.componentInstance;
    component.socket = io.connect(location.host);
    component.currentSlide = {
      img: "data:image/png;base64,foobarbaz",
      text: "Lecture 2 - Java Basics",
      quizType: null
    }
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
