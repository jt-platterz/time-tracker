import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import * as moment from 'moment';
import { dateParamToDate } from './day.helpers';

@Injectable()
export class DayGuard implements CanActivate {
  constructor(private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!route.params.date) {
      return this._goToToday();
    }

    return this._compareDate(route.params.date);
  }

  private _goToToday(): boolean {
    this._router.navigate(['today']);

    return false;
  }

  private _compareDate(param: string): boolean {
    const today = moment().startOf('day');
    const routeDate = dateParamToDate(param);

    return routeDate.isSame(today) ? this._goToToday() : true;
  }
}
