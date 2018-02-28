import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LecturerService } from '../../services/lecturer.service';
import { Lecturer } from '../../models/lecturer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  lecturer: Lecturer;
  lectures: string[];

  constructor(private lecturerService: LecturerService, private router: Router) { }

  ngOnInit() {
    this.lecturerService.getCurrentLecturer().subscribe(lecturer => this.lecturer = lecturer,
      err => {
        console.error(err);
        this.router.navigate(['login']);
      });
    this.lectures = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth"
    ]
    // this.lectures = [];
    this.openDiscovery();
  }

  openDiscovery(): void {
    $('.tap-target').tapTarget('open');
  }

  closeDiscovery(): void {
    $('.tap-target').tapTarget('close');
  }
}
