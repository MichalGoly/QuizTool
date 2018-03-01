import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';

import { LecturerService } from '../../services/lecturer.service';
import { LectureService } from '../../services/lecture.service';
import { AuthService } from '../../services/auth.service';

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
    private router: Router, private authService: AuthService) {
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
    this.authorizeUploader();

    // override uploader listeners
    this.uploader.onAfterAddingFile = (file) => {
      this.uploader.uploadAll();
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log("PdfUpload:uploaded:", item, status, response);
    };
  }

  openDiscovery(): void {
    $('.tap-target').tapTarget('open');
  }

  closeDiscovery(): void {
    $('.tap-target').tapTarget('close');
  }

  // Appends the Authorization: Bearer <JWT_TOKEN> to the uploader's requests
  // https://github.com/valor-software/ng2-file-upload/issues/317
  private authorizeUploader(): void {
    const authHeader: Array<{
      name: string;
      value: string;
    }> = [];
    authHeader.push({ name: 'Authorization', value: 'Bearer ' + this.authService.getToken() });
    const uploadOptions = <FileUploaderOptions>{ headers: authHeader };
    this.uploader.setOptions(uploadOptions);
  }
}
