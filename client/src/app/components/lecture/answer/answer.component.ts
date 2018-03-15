import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

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

  @Input()
  sessionCode: string;

  options: string[];
  chosenOption: string;
  isSubmitted: boolean;

  constructor(private quizService: QuizService) {
    this.isSubmitted = false;
  }

  ngOnInit() {
    this.init();
    this.socket.on('correct-received', (correctAnswer: any) => {
      if (this.isValid(correctAnswer)) {
        let element = $('#' + correctAnswer["option"]);
        if (element.hasClass('yellow'))
          element.removeClass('yellow');
        if (element.hasClass('blue'))
          element.removeClass('blue');
        element.addClass('green');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges called");
    this.init();
  }

  init(): void {
    this.options = this.quizService.extractOptions(this.currentSlide["text"]);
    this.chosenOption = null;
    this.isSubmitted = false;

    // clean up buttons' states
    if ($('#btn-submit').hasClass('disabled')) {
      $('#btn-submit').removeClass('disabled');
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

  choose(option: string): void {
    this.handleSelection(option);
    this.chosenOption = option;
  }

  submit(): void {
    /*
    * 1. Disable all buttons
    * 2. Submit the chosenOption using sockets
    */
    if (this.chosenOption !== null) {
      $("#btn-submit").addClass('disabled');
      const answer = {
        sessionCode: this.sessionCode,
        option: this.chosenOption
      };
      this.socket.emit('answer-sent', answer);
    }
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

  isValid(answer: any): boolean {
    return answer !== null && answer !== undefined && answer.sessionCode !== null
      && answer.sessionCode !== undefined && answer.option !== null && answer.option !== undefined
      && this.sessionCode === answer.sessionCode;
  }
}
