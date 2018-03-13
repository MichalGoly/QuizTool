import { Injectable } from '@angular/core';
import { Lecturer } from '../models/lecturer';
import { HttpClient } from '@angular/common/http';

const ENDPOINT = 'express/lecturers/';

@Injectable()
export class LecturerService {

  constructor(private http: HttpClient) { }

  // Retrieves the currently logged in lecturer. The jwt interceptor makes sure this
  // works by appending the authorization header to the HTTP request.s
  getCurrentLecturer() {
    return this.http.get<Lecturer>(ENDPOINT + 'logged-in');
  }
}
