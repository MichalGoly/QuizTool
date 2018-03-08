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
  }

  navigateBack(): void {
    this.emitSessionOver();
    this.lectureChange.emit(null);
  }

  isPreviousDisabled(): boolean {
    return this.currentIndex <= 0;
  }

  isNextDisabled(): boolean {
    return this.currentIndex >= this.slides.length - 1;
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
    console.log("emitCurrentSlide called");
    const currentSlide = {
      img: this.slides[this.currentIndex].image
    };
    this.socket.emit('slide-update', currentSlide);
  }

  emitSessionOver(): void {
    this.socket.emit('slide-update', {
      img: null
    });
  }
}
