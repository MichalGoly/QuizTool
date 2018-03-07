import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Lecture } from '../../models/lecture';
import { Slide } from '../../models/slide';
import { SlideService } from '../../services/slide.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.sass']
})
export class BroadcastComponent implements OnInit {

  @Input()
  lecture: Lecture;

  @Output()
  lectureChange: EventEmitter<Lecture> = new EventEmitter<Lecture>();

  slides: Slide[];
  currentIndex: number;

  constructor(private slideService: SlideService) { }

  ngOnInit() {
    this.slideService.getByLectureId(this.lecture._id).subscribe(slides => this.slides = slides,
      err => {
        console.error(err);
        // TODO this should be handled by an error handler
      });
    this.currentIndex = 0;
  }

  navigateBack(): void {
    this.lectureChange.emit(null);
  }

  isPreviousDisabled(): boolean {
    return this.currentIndex <= 0;
  }

  isNextDisabled(): boolean {
    return this.currentIndex >= this.slides.length - 1;
  }

  previousSlide(): void {
    if (!this.isPreviousDisabled()) {
      this.currentIndex--;
    }
  }

  nextSlide(): void {
    if (!this.isNextDisabled()) {
      this.currentIndex++;
    }
  }

}
