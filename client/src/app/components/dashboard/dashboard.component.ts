import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  isCookie: boolean;
  authCookie: string;

  constructor(private cookieService: CookieService) { }

  ngOnInit() {
    this.isCookie = this.cookieService.check("auth");
    this.authCookie = this.cookieService.get("auth");
  }

}
