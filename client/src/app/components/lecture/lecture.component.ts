import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.sass']
})
export class LectureComponent implements OnInit {

  sessionCode: string;
  socket: SocketIOClient.Socket;
  image: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionCode = params['code'];
      this.socket = io.connect(location.host);
      this.socket.on('slide-change', (slide: any) => {
        if (this.sessionCode === slide.sessionCode) {
          if (slide.img === null) {
            // session is over
            this.image = null;
          } else {
            this.image = 'data:image/png;base64,' + slide.img;
          }
        }
      });
    });
  }

}
