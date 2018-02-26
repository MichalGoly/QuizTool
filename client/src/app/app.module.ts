import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MzButtonModule } from 'ng2-materialize'
import { MzCardModule } from 'ng2-materialize'
import { MzTabModule } from 'ng2-materialize'
import { MzInputModule } from 'ng2-materialize'

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MzButtonModule,
    MzCardModule,
    MzTabModule,
    MzInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
