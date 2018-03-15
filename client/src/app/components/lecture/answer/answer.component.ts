import { Component, OnInit, Input } from '@angular/core';

import { QuizService } from '../../../services/quiz.service';

@Component({
  selector: 'lecture-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.sass']
})
export class AnswerComponent implements OnInit {

  @Input()
  currentSlide: Object;

  @Input()
  socket: SocketIOClient.Socket;

  options: string[];
  chosenOption: string;
  isSubmitted: boolean;

  constructor(private quizService: QuizService) {
    this.isSubmitted = false;
  }

  ngOnInit() {
    this.options = this.quizService.extractOptions(this.currentSlide["text"]);
  }

  choose(option: string): void {
    this.handleSelection(option);
    this.chosenOption = option;
  }

  submit(): void {
    /*
    * 1. Disable all buttons
    * 2. Submit the chosenOption using sockets
    */
    console.log("Submitting: " + this.chosenOption);
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
