import { Injectable } from '@angular/core';

import { Session } from '../models/session';
import { Lecture } from '../models/lecture';

import * as jsPDF from 'jspdf'

@Injectable()
export class ReportService {

  constructor() { }

  generateReport(session: Session, lecture: Lecture): Promise<any> {
    /*
    * 1. Use pdfjs to build the document
    * 2. Put lecture title and session's date on the pdf
    * 3. Retrieve all slides for the lecture
    * 4. Iterate over the slides
    *.4.1. Put each slide img on the report, next to students' answers if exist
    * 5. Generate a pdf file and download to user's machine
    */
    return new Promise((resolve, reject) => {
      let report = new jsPDF();
      report.text(20, 20, "Hello, world");
      report.save('hello.pdf');
      resolve();
    });
  }

}
