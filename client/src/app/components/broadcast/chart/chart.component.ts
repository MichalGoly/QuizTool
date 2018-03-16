import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'broadcast-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnInit {

  @Input()
  liveAnswers: Object;

  @Input()
  options: string[];

  constructor() { }

  ngOnInit() {
    console.log("HELLO");
    console.log(this.liveAnswers);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges called");
    console.log(JSON.stringify(this.liveAnswers));
    console.log(JSON.stringify(this.options));
  }

  getCount(option: string) {
    let out = "0";
    if (this.liveAnswers !== null && this.liveAnswers !== undefined && this.liveAnswers[option] !== undefined) {
      out = this.liveAnswers[option];
    }
    return out;
  }

}
