import { TestBed, inject } from '@angular/core/testing';

import { QuizService } from './quiz.service';
import { Slide } from '../models/slide';

describe('QuizService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizService]
    });
  });

  it('should be created', inject([QuizService], (service: QuizService) => {
    expect(service).toBeTruthy();
  }));

  it('should check if slide eligible to become a quiz', inject([QuizService], (service: QuizService) => {
    let slide = new Slide();
    slide._id = "123";
    slide.image = "data:image/png;base64, iVBORw0KGgoAA";
    slide.lectureId = "1234";
    slide.quizType = null;
    slide.slideNumber = 2;
    slide.text = "Some random text goes here";
    expect(service.isEligible(slide)).toBe(false);
    slide.text = "1. There we go 2) This is bad";
    expect(service.isEligible(slide)).toBe(false);
    slide.text = "dsadas 1) Hello 2) there 3) lol";
    expect(service.isEligible(slide)).toBe(false);
    slide.text = "";
    expect(service.isEligible(slide)).toBe(false);
    slide.text = "Lorem ipsum ∙ one∙∙∙∙∙";
    expect(service.isEligible(slide)).toBe(true);
    slide.text = "dsadas A) Hello B) there C) lol";
    expect(service.isEligible(slide)).toBe(true);
    slide.text = "A. There we go B) This is bad";
    expect(service.isEligible(slide)).toBe(false);
    slide.text = "A. There we go";
    expect(service.isEligible(slide)).toBe(false);
  }));

  it('should extract options from slide text and slide type provided', inject([QuizService], (service: QuizService) => {
    expect(service.extractOptions("Welcome to today's lecture \n ∙ Boring \n ∙ Awesome ∙ Not sure\ndasmdsa",
      "multi")).toEqual(["A", "B", "C"]);
    expect(service.extractOptions("Welcome to today's lecture \n A. Boring \n B. Awesome ∙ Not sure\ndasmdsa",
      "multi")).toEqual(["A", "B"]);
    expect(service.extractOptions("Welcome to today's lecture \n A) Boring \n B) Awesome C) Not sure\ndasmdsa",
      "multi")).toEqual(["A", "B", "C"]);
    expect(service.extractOptions("Welcome to today's lecture \n A) Boring \n B) Awesome C) Not sure\ndasmdsa",
      "truefalse")).toEqual(["true", "false"]);
    expect(service.extractOptions(null, "truefalse")).toEqual(["true", "false"]);
    expect(service.extractOptions(null, "single")).toEqual([]);
    expect(service.extractOptions(null, "multi")).toEqual([]);
    expect(service.extractOptions("There we go A) there B) is C) Hope", null)).toEqual([]);
    expect(service.extractOptions("∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ", "single")).toEqual(["A", "B", "C", "D", "E", "F", "G", "H", "I"]);
  }));
});
