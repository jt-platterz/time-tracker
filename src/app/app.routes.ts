import { Routes } from '@angular/router';
import { DayComponent } from './day/day.component';
import { DayGuard } from './day/day.guard';
import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';

export const appRoutes: Routes = [
  {path: '', redirectTo: 'today', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent},
  {path: 'today', component: DayComponent, canActivate: [AuthGuard]},
  {path: 'date/:date', component: DayComponent, canActivate: [AuthGuard, DayGuard]}
];
