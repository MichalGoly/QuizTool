import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BroadcastComponent } from './components/broadcast/broadcast.component';
import { LectureComponent } from './components/lecture/lecture.component';

import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'lecture/:code', component: LectureComponent },
  { path: '**', redirectTo: '' }
];

export const Routing = RouterModule.forRoot(routes)
