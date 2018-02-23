import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  title = 'app works!';
  messageText: string;
  messages: Array<any>;
  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect(location.host);
  }

  ngOnInit() {
    this.messages = new Array();
    this.title = "Java > Python";

    this.socket.on('message-received', (msg: any) => {
      this.messages.push(msg.text);
    });
    this.socket.emit('event1', {
      msg: 'Client to server, can you hear me server?'
    });
    this.socket.on('event2', (data: any) => {
      console.log(data.msg);
      this.socket.emit('event3', {
        msg: 'Yes, its working for me!!'
      });
    });
    this.socket.on('event4', (data: any) => {
      console.log(data.msg);
    });
  }

  sendMessage() {
    console.log("[INFO] sendMessage(): " + this.messageText);
    const message = {
      text: this.messageText
    };
    this.socket.emit('send-message', message);
    this.messageText = '';
  }
}
