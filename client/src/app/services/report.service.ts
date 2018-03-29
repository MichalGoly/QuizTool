import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { SlideService } from './slide.service';

import { Session } from '../models/session';
import { Lecture } from '../models/lecture';
import { Slide } from '../models/slide';

declare let jsPDF;

@Injectable()
export class ReportService {

  constructor(private slideService: SlideService, private datePipe: DatePipe) { }

  generateReport(session: Session, lecture: Lecture): Promise<any> {
    /*
    * 1. Use pdfjs to build the document
    * 2. Put lecture title and session's date on the pdf
    * 3. Retrieve all slides for the lecture
    * 4. Iterate over the slides
    *.4.1. Put each slide number on the report, next to students' answers if exist
    * 5. Generate a pdf file and download to user's machine
    */
    return new Promise((resolve, reject) => {
      let report = new jsPDF();
      report.text(20, 20, [
        "Lecture: " + lecture.fileName,
        "Date: " + this.datePipe.transform(session.date, 'M/d/yy, h:mm a')
      ]);
      this.slideService.getByLectureId(lecture._id).subscribe((slides) => {
        let columns = ["Slide no", "Answers", "Correct"];
        let rows = this.getRows(session, slides);
        report.autoTable(columns, rows, {
          margin: { top: 30 }
        });
        let timestamp = this.datePipe.transform(new Date(), 'yyyyMMdd_Hmmss');
        report.save('report_' + timestamp + '.pdf');
        resolve();
      }, err => {
        reject(err);
      });
    });
  }

  private getRows(session: Session, slides: Slide[]) {
    /*
    * 1. Iterate over the slides
    * 2. For each construct a row for the table
    * 3. Push the slide number
    * 4. Push answers given to each row, if exist
    * 5. Push the correct answers to each row, if exists
    * 6. Return all rows back to the caller
    */
    let out = [];
    for (let i = 0; i < slides.length; i++) {
      let row = [];
      row.push(slides[i].slideNumber);
      //4
      let answersCell = "";
      if (session.answers.hasOwnProperty(slides[i]._id)) {
        let slideAnswers = session.answers[slides[i]._id];
        for (var property in slideAnswers) {
          if (property !== "correct" && slideAnswers.hasOwnProperty(property)) {
            answersCell += property + ": " + slideAnswers[property] + ", ";
          }
        }
        // remove the trailing comma
        if (answersCell.length > 1) {
          answersCell = answersCell.substring(0, answersCell.length - 2);
        }
      } else {
        answersCell = "-";
      }
      row.push(answersCell);
      // 5
      let correctCell = "-";
      if (session.answers.hasOwnProperty(slides[i]._id)) {
        let slideAnswers = session.answers[slides[i]._id];
        if (slideAnswers.hasOwnProperty("correct")) {
          correctCell = slideAnswers["correct"];
        } else {
          correctCell = "Correct not chosen";
        }
      }
      row.push(correctCell);
      out.push(row);
    }
    return out;
  }

}
