import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Lecture } from '../../models/lecture';
import { Slide } from '../../models/slide';

import { SlideService } from '../../services/slide.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit {

  @Input()
  lecture: Lecture;

  @Output()
  lectureChange: EventEmitter<Lecture> = new EventEmitter<Lecture>();

  slides: Slide[];

  constructor(private slideService: SlideService) { }

  ngOnInit() {
    this.slideService.getByLectureId(this.lecture._id).subscribe(slides => {
      this.slides = slides;
    }, err => {
      // make this user friendly
      console.error(err);
    });
  }

  navigateBack(): void {
    this.lectureChange.emit(null);
  }

  save(): void {
    if (this.slides !== null) {
      this.slideService.bulkUpdateQuiz(this.slides).subscribe(() => {
        this.navigateBack();
      }, err => {
        console.error(err);
      });
    }
  }

  getSrc(image: string): string {
    return 'data:image/png;base64,' + image;
  }

}
