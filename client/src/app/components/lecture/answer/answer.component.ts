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

  @Input()
  sessionCode: string;

  options: string[];
  chosenOption: string;
  isSubmitted: boolean;
  correctAnswer: string;

  constructor(private quizService: QuizService) {
    this.isSubmitted = false;
  }

  ngOnInit() {
    this.options = this.quizService.extractOptions(this.currentSlide["text"]);
    this.chosenOption = null;
    this.isSubmitted = false;
    this.correctAnswer = null;

    this.socket.on('correct-received', (correctAnswer: any) => {
      if (this.isValid(correctAnswer)) {
        if (this.chosenOption == correctAnswer.option) {
          this.correctAnswer = "WELL DONE, IT WAS: " + correctAnswer.option;
        } else {
          this.correctAnswer = "BETTER LUCK NEXT TIME, IT WAS: " + correctAnswer.option;
        }
      }
    });
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
      for (let i = 0; i < this.options.length; i++) {
        $('#' + this.options[i]).addClass('disabled');
      }
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
