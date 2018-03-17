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

  constructor(private route: ActivatedRoute) {
    this.currentSlide = {};
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
            this.currentSlide["isQuiz"] = slide.isQuiz;
          }
        }
      });
    });
  }

}
