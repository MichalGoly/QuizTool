import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lecture-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.sass']
})
export class AnswerComponent implements OnInit {

  @Input()
  currentSlide: Object;

  constructor() { }

  ngOnInit() {
  }

}
