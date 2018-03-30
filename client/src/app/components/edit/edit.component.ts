import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Lecture } from '../../models/lecture';
import { Slide } from '../../models/slide';

import { SlideService } from '../../services/slide.service';
import { QuizService } from '../../services/quiz.service';
import { MzToastService } from 'ng2-materialize';

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

  constructor(private slideService: SlideService, private quizService: QuizService,
    private toastService: MzToastService) { }

  ngOnInit() {
    this.slideService.getByLectureId(this.lecture._id).subscribe(slides => {
      this.slides = slides;
    }, err => {
      this.toastService.show(err.error, 5000, 'red');
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
        this.toastService.show(err.error, 5000, 'red');
      });
    }
  }

  getSrc(image: string): string {
    return 'data:image/png;base64,' + image;
  }

  isEligibleTrueFalse(slide: Slide): boolean {
    return true; // every slide is eligible to become a true/false quiz
  }

  isEligibleSingle(slide: Slide): boolean {
    return this.quizService.isEligible(slide);
  }

  isEligibleMulti(slide: Slide): boolean {
    return this.quizService.isEligible(slide);
  }

}
