import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';

import { LecturerService } from '../../services/lecturer.service';
import { LectureService } from '../../services/lecture.service';
import { Lecturer } from '../../models/lecturer';
import { Lecture } from '../../models/lecture';

const UPLOAD_ENDPOINT = 'express/lectures';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  uploader: FileUploader;
  lecturer: Lecturer;
  lectures: Lecture[];

  constructor(private lecturerService: LecturerService, private lectureService: LectureService,
    private router: Router) {
    this.uploader = new FileUploader({ url: UPLOAD_ENDPOINT });
  }

  ngOnInit() {
    this.lecturerService.getCurrentLecturer().subscribe(lecturer => this.lecturer = lecturer,
      err => {
        console.error(err);
        this.router.navigate(['login']);
      });
    this.lectureService.getAll().subscribe(lectures => {
      this.lectures = lectures
      if (this.lectures.length === 0) {
        this.openDiscovery();
      }
    },
      err => {
        console.error(err);
      });
  }

  openDiscovery(): void {
    $('.tap-target').tapTarget('open');
  }

  closeDiscovery(): void {
    $('.tap-target').tapTarget('close');
  }
}
