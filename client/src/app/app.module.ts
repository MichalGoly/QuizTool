import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routing } from './app.routing';
import { JwtInterceptor } from './utils/jwt.interceptor';

import { MzButtonModule } from 'ng2-materialize'
import { MzCardModule } from 'ng2-materialize'
import { MzTabModule } from 'ng2-materialize'
import { MzInputModule } from 'ng2-materialize'
import { MzNavbarModule } from 'ng2-materialize'
import { MzSpinnerModule } from 'ng2-materialize'

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { LecturerService } from './services/lecturer.service';
import { LectureService } from './services/lecture.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    DashboardComponent
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
    MzNavbarModule
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
    LectureService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
