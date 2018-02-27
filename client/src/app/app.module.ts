import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routing } from './app.routing';

import { MzButtonModule } from 'ng2-materialize'
import { MzCardModule } from 'ng2-materialize'
import { MzTabModule } from 'ng2-materialize'
import { MzInputModule } from 'ng2-materialize'
import { MzNavbarModule } from 'ng2-materialize'

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { CookieService } from 'ngx-cookie-service';

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
    HttpModule,
    BrowserAnimationsModule,
    MzButtonModule,
    MzCardModule,
    MzTabModule,
    MzInputModule,
    MzNavbarModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
