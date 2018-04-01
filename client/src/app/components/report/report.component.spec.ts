import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { ReportComponent } from './report.component';

import { MzButtonModule } from 'ng2-materialize';
import { MzCollectionModule } from 'ng2-materialize';
import { MzTooltipModule } from 'ng2-materialize';
import { MzSpinnerModule } from 'ng2-materialize';

import { SessionService } from '../../services/session.service';
import { ReportService } from '../../services/report.service';
import { SlideService } from '../../services/slide.service';
import { MzToastService } from 'ng2-materialize';

import { Lecture } from '../../models/lecture';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportComponent],
      imports: [
        MzButtonModule,
        MzCollectionModule,
        MzTooltipModule,
        MzSpinnerModule,
        HttpClientModule
      ],
      providers: [
        SessionService,
        ReportService,
        MzToastService,
        SlideService,
        DatePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
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
