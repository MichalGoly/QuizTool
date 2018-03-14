import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';

import { Lecture } from '../../models/lecture';
import { Slide } from '../../models/slide';

import { SlideService } from '../../services/slide.service';

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

  constructor(private slideService: SlideService) { }

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
  }

  navigateBack(): void {
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
    }
  }

  nextSlide(): void {
    if (!this.isNextDisabled()) {
      this.currentIndex++;
      this.emitCurrentSlide();
    }
  }

  getSrc(image: string): string {
    return 'data:image/png;base64,' + image;
  }

  emitCurrentSlide(): void {
    const currentSlide = {
      img: this.slides[this.currentIndex].image,
      text: this.slides[this.currentIndex].text,
      isQuiz: this.slides[this.currentIndex].isQuiz,
      sessionCode: this.sessionCode
    };
    this.socket.emit('slide-update', currentSlide);
  }

  emitSessionOver(): void {
    this.socket.emit('slide-update', {
      img: null,
      text: null,
      isQuiz: false,
      sessionCode: this.sessionCode
    });
  }

  generateSessionCode(): string {
    let code = (new Date().getTime() * Math.random()).toString(36).substr(2, 8).toString();
    return code.replace(/\./g, '0'); // replace dots with 0
  }
}
