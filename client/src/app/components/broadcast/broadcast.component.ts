import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';

import { Lecture } from '../../models/lecture';
import { Slide } from '../../models/slide';

import { SlideService } from '../../services/slide.service';
import { QuizService } from '../../services/quiz.service';
import { SessionService } from '../../services/session.service';

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
  chosenOptions: string[];
  labelOptions: string[];

  constructor(private slideService: SlideService, private quizService: QuizService, private sessionService: SessionService) { }

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
        let option = this.convertToString(answer.options);
        if (this.liveAnswers.hasOwnProperty(option)) {
          // increment the count
          this.liveAnswers[option] += 1;
        } else {
          // initialise with a count 1
          this.liveAnswers[option] = 1;
        }
        // update options
        if (!this.options.includes(option)) {
          this.options.push(option);
          this.options = JSON.parse(JSON.stringify(this.options));
        }
        // clone the object to trigger onChanges lifecycle hook in the child component
        this.liveAnswers = JSON.parse(JSON.stringify(this.liveAnswers));
      }
    });
  }

  navigateBack(): void {
    this.keepAnswer();
    if (this.answers.size !== 0) {
      let session = this.sessionService.buildSession(this.answers, new Date(), this.lecture._id);
      this.sessionService.newSession(session).subscribe(() => {
        this.emitSessionOver();
        this.lectureChange.emit(null);
      }, err => {
        console.error(err);
      });
    }
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
    this.chosenOptions = [];
    if (this.slides[this.currentIndex].quizType !== null) {
      this.options = this.quizService.extractOptions(this.slides[this.currentIndex].text,
        this.slides[this.currentIndex].quizType);
      this.labelOptions = JSON.parse(JSON.stringify(this.options));
      if ($("#btn-submit").hasClass('disabled')) {
        $("#btn-submit").removeClass('disabled');
      }
      for (let i = 0; i < this.labelOptions.length; i++) {
        let element = $('#' + this.labelOptions[i]);
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
    if (this.slides[this.currentIndex].quizType === "multi") {
      let index = this.chosenOptions.indexOf(option);
      if (index > -1) {
        // option already in chosenOptions, remove it
        this.chosenOptions.splice(index, 1);
      } else {
        // option not in chosenOptions, add it
        this.chosenOptions.push(option);
      }
    } else {
      this.chosenOptions = [option];
    }
    this.liveAnswers["correct"] = this.convertToString(this.chosenOptions);
  }

  // Flattens the provided array of strings into a single string e.g. ["A", "B"] => "AB"
  convertToString(chosenOptions: string[]): string {
    /*
    * 1. Sort the array alphabetically
    * 2. Flatten to string
    */
    let clone = JSON.parse(JSON.stringify(chosenOptions));
    clone.sort();
    let out = "";
    for (let i = 0; i < clone.length; i++) {
      out += clone[i];
    }
    return out;
  }

  submit(): void {
    if (this.chosenOptions !== []) {
      $('#btn-submit').addClass('disabled');
      this.socket.emit('correct-answer', {
        sessionCode: this.sessionCode,
        options: this.chosenOptions
      });
    }
  }

  askAgain(): void {
    this.liveAnswers = {};
    this.chosenOptions = [];
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
      && answer.sessionCode !== undefined && answer.options !== null && answer.options !== undefined
      && answer.options.length !== undefined && answer.options.length > 0 && this.sessionCode === answer.sessionCode;
  }

  handleSelection(option: string): void {
    if (this.slides[this.currentIndex].quizType === "multi") {
      /*
      * 1. Toggle the color of the button corresonding to the option
      */
      let element = $('#' + option);
      if (element.hasClass('blue')) {
        element.removeClass('blue');
        element.addClass('yellow');
      } else if (element.hasClass('yellow')) {
        element.removeClass('yellow');
        element.addClass('blue');
      }
    } else {
      /*
      * 1. Deselect previosuly selected buttons
      * 2. Select the on passed into the method
      */
      for (let i = 0; i < this.labelOptions.length; i++) {
        let element = $('#' + this.labelOptions[i]);
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
}
