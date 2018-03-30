import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Lecture } from '../../models/lecture';
import { Session } from '../../models/session';

import { SessionService } from '../../services/session.service';
import { ReportService } from '../../services/report.service';
import { MzToastService } from 'ng2-materialize';

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

  sessions: Session[];
  isGeneratingReport: boolean;

  constructor(private sessionService: SessionService, private reportService: ReportService,
    private toastService: MzToastService) {
    this.isGeneratingReport = false;
  }

  ngOnInit() {
    this.sessionService.getByLectureId(this.lecture._id).subscribe((sessions) => {
      this.sessions = sessions;
    }, (err) => {
      this.toastService.show(err.error, 5000, 'red');
    });
  }

  navigateBack(): void {
    this.lectureChange.emit(null);
  }

  generateReport(session: Session): void {
    this.isGeneratingReport = true;
    this.reportService.generateReport(session, this.lecture).then(() => {
      this.isGeneratingReport = false;
    }).catch((err) => {
      this.toastService.show(err.error, 5000, 'red');
    });
  }

}
