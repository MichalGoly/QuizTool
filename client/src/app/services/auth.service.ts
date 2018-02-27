import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from "@angular/router";

const COOKIE_KEY = "auth";

@Injectable()
export class AuthService {

  constructor(private cookieService: CookieService, private router: Router) { }

  isLoggedIn(): boolean {
    return this.cookieService.check(COOKIE_KEY);
  }

  logout(): void {
    if (this.isLoggedIn()) {
      this.cookieService.delete(COOKIE_KEY);
      this.router.navigate(['login']);
    }
  }
}
