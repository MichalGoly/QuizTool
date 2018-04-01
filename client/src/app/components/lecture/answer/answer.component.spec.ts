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
    component.sessionCode = "das2sa2as";
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should check if valid', () => {
    expect(component.isValid(null)).toBe(false);
    expect(component.isValid({})).toBe(false);
    expect(component.isValid({ "hello": 4231 })).toBe(false);
    expect(component.isValid({
      "sessionCode": "das2sa2as",
      "options": ["A", "C"]
    })).toBe(true);
    expect(component.isValid({
      "options": ["A", "C"]
    })).toBe(false);
  })
});
