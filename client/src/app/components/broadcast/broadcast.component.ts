import { Component, OnInit, Input } from '@angular/core';

import { Lecture } from '../../models/lecture';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.sass']
})
export class BroadcastComponent implements OnInit {

  @Input()
  lecture: Lecture;

  constructor() { }

  ngOnInit() {
  }

}
