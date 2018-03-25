import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Lecture } from '../../models/lecture';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.sass']
})
export class ReportComponent implements OnInit {

  @Input()
  lecture: Lecture;

  @Output()
  lectureChange: EventEmitter<Lecture> = new EventEmitter<Lecture>();

  sessions: string;

  constructor(private sessionService: SessionService) { }

  ngOnInit() {
    this.sessionService.getByLectureId(this.lecture._id).subscribe((sessions) => {
      this.sessions = JSON.stringify(sessions);
    }, (err) => {
      console.error(err);
    });
  }

  navigateBack(): void {
    this.lectureChange.emit(null);
  }

}
