import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.sass']
})
export class LectureComponent implements OnInit {

  socket: SocketIOClient.Socket;
  sessionCode: string;
  currentSlide: any;
  isFirstSlideReceived: boolean;

  constructor(private route: ActivatedRoute) {
    this.currentSlide = {};
    this.isFirstSlideReceived = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionCode = params['code'];
      this.socket = io.connect(location.host);
      this.socket.on('slide-change', (slide: any) => {
        if (this.sessionCode === slide.sessionCode) {
          if (slide.img === null) {
            // session is over
            this.currentSlide = null;
          } else {
            this.currentSlide = {}; // needed for the ngOnChanges to fire in the answer.component
            this.currentSlide["img"] = 'data:image/png;base64,' + slide.img;
            this.currentSlide["text"] = slide.text;
            this.currentSlide["quizType"] = slide.quizType;
            this.isFirstSlideReceived = true;
          }
        }
      });
      if (!this.isFirstSlideReceived) {
        this.requestCurrentSlide();
      }
      this.socket.on('current-slide-received', (slide: any) => {
        if (this.sessionCode === slide.sessionCode && !this.isFirstSlideReceived) {
          this.currentSlide = {}; // needed for the ngOnChanges to fire in the answer.component
          this.currentSlide["img"] = 'data:image/png;base64,' + slide.img;
          this.currentSlide["text"] = slide.text;
          this.currentSlide["quizType"] = slide.quizType;
          this.isFirstSlideReceived = true;
        }
      });
    });
  }

  // sends off a request to the server to get the currently broadcasted slide,
  // if the user joined after the session has already started. Without this method, student
  // would have to wait until the next 'slide-change' event to render the current slide.
  requestCurrentSlide(): void {
    this.socket.emit('current-slide-request', {
      sessionCode: this.sessionCode
    });
  }

}
