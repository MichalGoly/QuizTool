import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LecturerService } from '../../services/lecturer.service';
import { LectureService } from '../../services/lecture.service';
import { Lecturer } from '../../models/lecturer';
import { Lecture } from '../../models/lecture';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  lecturer: Lecturer;
  lectures: Lecture[];

  constructor(private lecturerService: LecturerService, private lectureService: LectureService,
    private router: Router) { }

  ngOnInit() {
    this.lecturerService.getCurrentLecturer().subscribe(lecturer => this.lecturer = lecturer,
      err => {
        console.error(err);
        this.router.navigate(['login']);
      });
    this.lectureService.getAll().subscribe(lectures => this.lectures = lectures,
      err => {
        console.error(err);
      });
    this.openDiscovery();
  }

  openDiscovery(): void {
    $('.tap-target').tapTarget('open');
  }

  closeDiscovery(): void {
    $('.tap-target').tapTarget('close');
  }
}
