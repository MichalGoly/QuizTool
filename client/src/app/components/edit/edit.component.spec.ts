import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Lecture } from '../../models/lecture';
import { EditComponent } from './edit.component';

import { MzButtonModule } from 'ng2-materialize';
import { MzRadioButtonModule } from 'ng2-materialize';
import { MzSpinnerModule } from 'ng2-materialize';
import { MzInputModule } from 'ng2-materialize';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SlideService } from '../../services/slide.service';
import { QuizService } from '../../services/quiz.service';
import { MzToastService } from 'ng2-materialize';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditComponent
      ],
      imports: [
        MzButtonModule,
        MzRadioButtonModule,
        MzSpinnerModule,
        MzInputModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [
        SlideService,
        QuizService,
        MzToastService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    component.lecture = new Lecture();
    component.lecture._id = "41224d776a326fb40f000001";
    component.lecture.fileName = "presentation.pdf";
    component.lecture.lecturerId = "41224d776a326fb40f000002";
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
