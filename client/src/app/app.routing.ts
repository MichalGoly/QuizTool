import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BroadcastComponent } from './components/broadcast/broadcast.component';

import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

export const Routing = RouterModule.forRoot(routes)
