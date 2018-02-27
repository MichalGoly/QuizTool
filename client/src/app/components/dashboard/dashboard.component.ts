import { Component, OnInit } from '@angular/core';

import { LecturerService } from '../../services/lecturer.service';
import { Lecturer } from '../../models/lecturer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  // isCookie: boolean;
  // authCookie: string;

  lecturer: Lecturer;

  constructor(private lecturerService: LecturerService) { }

  ngOnInit() {
    // this.isCookie = this.cookieService.check("auth");
    // this.authCookie = this.cookieService.get("auth");
    this.lecturerService.getCurrentLecturer().subscribe(lecturer => this.lecturer = lecturer);
  }

}
