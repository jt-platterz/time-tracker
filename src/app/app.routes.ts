import { Routes } from '@angular/router';
import { DayComponent } from './day/day.component';
import { DayGuard } from './day/day.guard';

export const appRoutes: Routes = [
  {path: '', redirectTo: 'today', pathMatch: 'full'},
  {path: 'today', component: DayComponent},
  {path: 'date/:date', component: DayComponent, canActivate: [DayGuard]}
];
