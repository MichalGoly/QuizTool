import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  @Input()
  isDashboard: boolean;

  @Input()
  sessionCode: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  logout(): void {
    this.authService.logout();
  }

}
