import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routing } from './app.routing';
import { JwtInterceptor } from './utils/jwt.interceptor';
import { FileUploadModule } from 'ng2-file-upload';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { MzButtonModule } from 'ng2-materialize'
import { MzCardModule } from 'ng2-materialize'
import { MzTabModule } from 'ng2-materialize'
import { MzInputModule } from 'ng2-materialize'
import { MzNavbarModule } from 'ng2-materialize'
import { MzSpinnerModule } from 'ng2-materialize'
import { MzCheckboxModule } from 'ng2-materialize'
import { MzRadioButtonModule } from 'ng2-materialize'

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BroadcastComponent } from './components/broadcast/broadcast.component';
import { LectureComponent } from './components/lecture/lecture.component';
import { EditComponent } from './components/edit/edit.component';
import { AnswerComponent } from './components/lecture/answer/answer.component';
import { ChartComponent } from './components/broadcast/chart/chart.component';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { LecturerService } from './services/lecturer.service';
import { LectureService } from './services/lecture.service';
import { SlideService } from './services/slide.service';
import { QuizService } from './services/quiz.service';
import { SessionService } from './services/session.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    DashboardComponent,
    BroadcastComponent,
    LectureComponent,
    EditComponent,
    AnswerComponent,
    ChartComponent
  ],
  imports: [
    Routing,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MzButtonModule,
    MzCardModule,
    MzTabModule,
    MzInputModule,
    MzNavbarModule,
    FileUploadModule,
    MzSpinnerModule,
    MzCheckboxModule,
    ChartsModule,
    MzRadioButtonModule
  ],
  providers: [
    CookieService,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    LecturerService,
    LectureService,
    SlideService,
    QuizService,
    SessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
