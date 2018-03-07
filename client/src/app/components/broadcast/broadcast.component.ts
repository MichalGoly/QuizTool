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

  constructor(private slideService: SlideService) { }

  ngOnInit() {
    this.slideService.getByLectureId(this.lecture._id).subscribe(slides => this.slides = slides,
      err => {
        console.error(err);
        // TODO this should be handled by an error handler
      });
  }

  navigateBack(): void {
    this.lectureChange.emit(null);
  }

}
