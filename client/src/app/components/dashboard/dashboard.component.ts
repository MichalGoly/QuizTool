import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { saveAs } from "file-saver";

import { LecturerService } from '../../services/lecturer.service';
import { LectureService } from '../../services/lecture.service';
import { AuthService } from '../../services/auth.service';
import { MzToastService } from 'ng2-materialize';

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
  lectureBroadcasted: Lecture;
  lectureEdited: Lecture;
  lectureReported: Lecture;

  constructor(private lecturerService: LecturerService, private lectureService: LectureService,
    private router: Router, private authService: AuthService, private toastService: MzToastService) {
    this.uploader = new FileUploader({
      url: UPLOAD_ENDPOINT,
      allowedMimeType: ['application/pdf'],
      autoUpload: true
    });
  }

  ngOnInit() {
    this.lecturerService.getCurrentLecturer().subscribe(lecturer => this.lecturer = lecturer,
      err => {
        this.toastService.show(err.error.error, 5000, 'red');
        this.router.navigate(['login']);
      });
    this.refreshLecturers();
    this.authorizeUploader();
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      // console.log("PdfUpload:uploaded:", item, status, response);
      this.uploader.clearQueue();
      this.refreshLecturers();
    };
    this.uploader.onErrorItem = (item: any, response: string, status: any, headers: any) => {
      this.uploader.clearQueue();
      this.toastService.show("File upload failed (max file size 15MB)", 5000, 'red');
    };
  }

  refreshLecturers(): void {
    this.lectureService.getAll().subscribe(lectures => {
      this.lectures = lectures;
      if (this.lectures.length === 0) {
        this.openDiscovery();
      }
    },
      err => {
        this.toastService.show(err.error.error, 5000, 'red');
      });
  }

  edit(lecture: Lecture): void {
    this.lectureEdited = lecture;
  }

  openReports(lecture: Lecture): void {
    this.lectureReported = lecture;
  }

  broadcast(lecture: Lecture): void {
    this.lectureBroadcasted = lecture;
  }

  // Truncates long file names and adds "..." at the end
  formatTitle(fileName: string): string {
    return fileName.length < 15 ? fileName : fileName.substring(0, 15) + "...";
  }

  openDiscovery(): void {
    $('.tap-target').tapTarget('open');
  }

  closeDiscovery(): void {
    $('.tap-target').tapTarget('close');
  }

  remove(lecture: Lecture): void {
    this.lectureService.delete(lecture._id).subscribe(() => {
      this.refreshLecturers();
    }, err => {
      this.toastService.show(err.error.error, 5000, 'red');
    });
  }

  download(lecture: Lecture): void {
    this.lectureService.getFile(lecture._id).subscribe(blob => {
      saveAs(blob, lecture.fileName);
    }, err => {
      this.toastService.show(err.error.error, 5000, 'red');
    })
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
