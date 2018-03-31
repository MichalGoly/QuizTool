import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { RouterTestingModule } from '@angular/router/testing';

import { LectureComponent } from './lecture.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { AnswerComponent } from './answer/answer.component';

import { MzNavbarModule } from 'ng2-materialize';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

describe('LectureComponent', () => {
  let component: LectureComponent;
  let fixture: ComponentFixture<LectureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LectureComponent, NavbarComponent, AnswerComponent],
      imports: [MzNavbarModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({ id: 123 })
          }
        },
        AuthService,
        CookieService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
