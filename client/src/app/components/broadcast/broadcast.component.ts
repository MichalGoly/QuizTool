import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';

import { Lecture } from '../../models/lecture';
import { Slide } from '../../models/slide';

import { SlideService } from '../../services/slide.service';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.sass']
})
export class BroadcastComponent implements OnInit {

  @Input()
  lecture: Lecture;

  @Output()
  lectureChange: EventEmitter<Lecture> = new EventEmitter<Lecture>();

  slides: Slide[];
  currentIndex: number;
  socket: SocketIOClient.Socket;
  sessionCode: string;
  answers: Map<string, Object>;
  liveAnswers: Object;
  options: string[];
  chosenOption: string;

  constructor(private slideService: SlideService, private quizService: QuizService) { }

  ngOnInit() {
    this.slideService.getByLectureId(this.lecture._id).subscribe((slides) => {
      this.slides = slides;
      this.emitCurrentSlide();
    }, err => {
      console.error(err);
      // TODO this should be handled by an error handler
    });
    this.currentIndex = 0;
    this.socket = io.connect(location.host);
    this.sessionCode = this.generateSessionCode();
    this.answers = new Map<string, Object>();
    this.liveAnswers = {};

    this.socket.on('answer-received', (answer: any) => {
      if (this.isValid(answer)) {
        if (this.liveAnswers.hasOwnProperty(answer.option)) {
          // increment the count
          this.liveAnswers[answer.option] += 1;
        } else {
          // initialise with a count 1
          this.liveAnswers[answer.option] = 1;
        }
        // clone the object to trigger onChanges lifecycle hook in the child component
        this.liveAnswers = JSON.parse(JSON.stringify(this.liveAnswers));
      }
    });
  }

  navigateBack(): void {
    this.keepAnswer();
    if (this.answers.size !== 0) {
      let session = {
        answers: this.answers,
        date: new Date(),
        lectureId: this.lecture._id
      };
      console.log(session);
    }
    this.emitSessionOver();
    this.lectureChange.emit(null);
  }

  isPreviousDisabled(): boolean {
    return this.currentIndex <= 0;
  }

  isNextDisabled(): boolean {
    if (this.slides !== null && this.slides !== undefined) {
      return this.currentIndex >= this.slides.length - 1;
    }
  }

  previousSlide(): void {
    if (!this.isPreviousDisabled()) {
      this.currentIndex--;
      this.emitCurrentSlide();
      this.discardAnswer();
    }
  }

  nextSlide(): void {
    if (!this.isNextDisabled()) {
      this.keepAnswer();
      this.currentIndex++;
      this.emitCurrentSlide();
    }
  }

  cleanUp(): void {
    this.liveAnswers = {};
    this.chosenOption = null;
    if (this.slides[this.currentIndex].quizType !== null) {
      this.options = this.quizService.extractOptions(this.slides[this.currentIndex].text,
        this.slides[this.currentIndex].quizType);
      if ($("#btn-submit").hasClass('disabled')) {
        $("#btn-submit").removeClass('disabled');
      }
      for (let i = 0; i < this.options.length; i++) {
        let element = $('#' + this.options[i]);
        if (element.hasClass('green'))
          element.removeClass('green');
        if (element.hasClass('yellow'))
          element.removeClass('yellow');
        if (!element.hasClass('blue'))
          element.addClass('blue');
      }
    }
  }

  getSrc(image: string): string {
    return 'data:image/png;base64,' + image;
  }

  emitCurrentSlide(): void {
    this.cleanUp();
    const currentSlide = {
      img: this.slides[this.currentIndex].image,
      text: this.slides[this.currentIndex].text,
      quizType: this.slides[this.currentIndex].quizType,
      sessionCode: this.sessionCode
    };
    this.socket.emit('slide-update', currentSlide);
  }

  emitSessionOver(): void {
    this.socket.emit('slide-update', {
      img: null,
      text: null,
      quizType: null,
      sessionCode: this.sessionCode
    });
  }

  choose(option: string): void {
    this.handleSelection(option);
    this.chosenOption = option;
    this.liveAnswers["correct"] = this.chosenOption;
  }

  submit(): void {
    if (this.chosenOption !== null) {
      $('#btn-submit').addClass('disabled');
      this.socket.emit('correct-answer', {
        sessionCode: this.sessionCode,
        option: this.chosenOption
      });
    }
  }

  askAgain(): void {
    this.liveAnswers = {};
    this.chosenOption = null;
    this.emitCurrentSlide();
  }

  // adds students' answers to the in memory map
  keepAnswer(): void {
    if (this.slides[this.currentIndex].quizType !== null) {
      this.answers.set(this.slides[this.currentIndex]._id, this.liveAnswers);
    }
  }

  // moving back removes the previously submitted answers from the map
  discardAnswer(): void {
    let currentSlide = this.slides[this.currentIndex];
    if (currentSlide.quizType !== null && this.answers.has(currentSlide._id)) {
      this.answers.delete(currentSlide._id);
    }
  }

  generateSessionCode(): string {
    let code = (new Date().getTime() * Math.random()).toString(36).substr(2, 8).toString();
    return code.replace(/\./g, '0'); // replace dots with 0
  }

  isValid(answer: any): boolean {
    return answer !== null && answer !== undefined && answer.sessionCode !== null
      && answer.sessionCode !== undefined && answer.option !== null && answer.option !== undefined
      && this.sessionCode === answer.sessionCode;
  }

  handleSelection(option: string): void {
    /*
    * 1. Deselect previosuly selected buttons
    * 2. Select the on passed into the method
    */
    for (let i = 0; i < this.options.length; i++) {
      let element = $('#' + this.options[i]);
      if (element.hasClass('yellow')) {
        element.removeClass('yellow');
      }
      if (!element.hasClass('blue')) {
        element.addClass('blue');
      }
    }
    $('#' + option).addClass('yellow');
  }
}
