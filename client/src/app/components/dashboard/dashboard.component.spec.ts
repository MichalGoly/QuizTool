import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { BroadcastComponent } from '../broadcast/broadcast.component';
import { EditComponent } from '../edit/edit.component';
import { ReportComponent } from '../report/report.component';
import { ChartComponent } from '../broadcast/chart/chart.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { MzTooltipModule } from 'ng2-materialize';
import { MzButtonModule } from 'ng2-materialize';
import { MzSpinnerModule } from 'ng2-materialize';
import { MzNavbarModule } from 'ng2-materialize';
import { MzRadioButtonModule } from 'ng2-materialize';
import { MzCollectionModule } from 'ng2-materialize';

import { FileUploadModule } from 'ng2-file-upload';
import { FileSelectDirective } from 'ng2-file-upload';

import { LecturerService } from '../../services/lecturer.service';
import { LectureService } from '../../services/lecture.service';
import { AuthService } from '../../services/auth.service';
import { MzToastService } from 'ng2-materialize';
import { CookieService } from 'ngx-cookie-service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  class AuthServiceMock {

    COOKIE_KEY: string = "auth";

    cookie: Object = {
      "auth": "thisIsAVerySecureToken123"
    }

    isLoggedIn(): boolean {
      return this.cookie[this.COOKIE_KEY] !== undefined;
    }

    logout(): void {
      if (this.isLoggedIn()) {
        delete this.cookie[this.COOKIE_KEY];
      }
    }

    getToken(): string {
      if (this.isLoggedIn()) {
        return this.cookie[this.COOKIE_KEY];
      }
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        NavbarComponent,
        BroadcastComponent,
        EditComponent,
        ReportComponent,
        FileSelectDirective,
        ChartComponent
      ],
      imports: [
        MzTooltipModule,
        MzButtonModule,
        MzSpinnerModule,
        MzNavbarModule,
        FormsModule,
        MzRadioButtonModule,
        MzCollectionModule,
        ChartsModule,
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [
        FileUploadModule,
        LecturerService,
        LectureService,
        { provide: AuthService, useClass: AuthServiceMock },
        MzToastService,
        CookieService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
