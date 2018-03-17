import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';

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

  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;

  barChartData: any[];
  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.barChartData = [];
    let dataset = {
      label: "Answers"
    };
    for (let i = 0; i < this.options.length; i++) {
      if (!dataset.hasOwnProperty("data")) {
        dataset["data"] = [];
      }
      dataset["data"].push(this.getCount(this.options[i]));
    }
    this.barChartData.push(dataset);
    // trigger ngOnChanges in the char.js wrapper component and force chart to redraw itself
    // https://github.com/valor-software/ng2-charts/issues/291
    this.barChartData = JSON.parse(JSON.stringify(this.barChartData));
    this.options = JSON.parse(JSON.stringify(this.options));
    if (this.chart !== null && this.chart !== undefined && this.chart.chart !== undefined) {
      this.chart.chart.update();
    }
  }

  getCount(option: string) {
    let out = 0;
    if (this.liveAnswers !== null && this.liveAnswers !== undefined && this.liveAnswers[option] !== undefined) {
      out = this.liveAnswers[option];
    }
    return out;
  }

}
