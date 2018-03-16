import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'broadcast-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnInit {

  @Input()
  liveAnswers: Object;

  constructor() { }

  ngOnInit() {
  }

}
