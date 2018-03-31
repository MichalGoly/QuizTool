import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { BroadcastComponent } from './broadcast.component';
import { ChartComponent } from './chart/chart.component';

import { MzToastService } from 'ng2-materialize';
import { MzToastModule } from 'ng2-materialize';
import { MzButtonModule } from 'ng2-materialize';
import { MzSpinnerModule } from 'ng2-materialize';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { SlideService } from '../../services/slide.service';
import { QuizService } from '../../services/quiz.service';
import { SessionService } from '../../services/session.service';

import { Lecture } from '../../models/lecture';

describe('BroadcastComponent', () => {
  let component: BroadcastComponent;
  let fixture: ComponentFixture<BroadcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MzButtonModule,
        MzToastModule,
        MzSpinnerModule,
        ChartsModule,
        HttpClientModule
      ],
      declarations: [
        BroadcastComponent,
        ChartComponent
      ],
      providers: [
        MzToastService,
        SlideService,
        QuizService,
        SessionService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastComponent);
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
