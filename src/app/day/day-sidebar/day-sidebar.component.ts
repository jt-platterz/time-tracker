import { Component, OnInit } from '@angular/core';
import { ReactiveComponent } from '../../reactive-component/reactive.component';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/app.state';
import { Moment } from '../../date/moment';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { dateParamToDate, nextDay, prevDay } from '../day.helpers';
import { eventOpenModal } from '../../event/store/event.actions';
import { IEvent } from '../../event/event.model';

@Component({
  selector: 'tt-day-sidebar',
  styleUrls: ['./day-sidebar.component.scss'],
  templateUrl: './day-sidebar.component.html'
})
export class DaySidebarComponent extends ReactiveComponent implements OnInit {
  routeParam$: Observable<string>;
  routeDate$: Observable<Moment>;
  displayDate$: Observable<Moment>;
  time$: Observable<string>;
  day$: Observable<string>;
  monthYear$: Observable<string>;

  prevDay$: Observable<string>;
  nextDay$: Observable<string>;
  isToday$: Observable<boolean>;

  now$: BehaviorSubject<Moment>;

  constructor(
    private _store: Store<IAppState>,
    private _route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.routeParam$ =
      this._route
        .params
        .map((p) => p.date)
        .takeUntil(this._destroy$);

    this.routeDate$ =
      this.routeParam$
        .distinctUntilChanged()
        .map(this._parseDate)
        .takeUntil(this._destroy$);

    this.now$ = this._registerSubject(new BehaviorSubject<Moment>(moment())) as BehaviorSubject<Moment>;

    this.displayDate$ =
      Observable
        .combineLatest(this.routeParam$, this.routeDate$, this.now$)
        .map(([routeParam, routeDate, now]) => !!routeParam ? routeDate : now)
        .takeUntil(this._destroy$);

    this.time$ =
      this.now$
        .takeUntil(this._destroy$)
        .map((now) => now.format('h:mm:ss A'));

    this.day$ =
      this.displayDate$
        .takeUntil(this._destroy$)
        .map((routeDate) => routeDate.format('dddd'));

    this.monthYear$ =
      this.displayDate$
        .takeUntil(this._destroy$)
        .map((routeDate) => routeDate.format('MMMM Do, YYYY'));

    this.nextDay$ =
      this.displayDate$
        .map((date) => nextDay(date));

    this.prevDay$ =
      this.displayDate$
        .map((date) => prevDay(date));

    this.isToday$ =
      Observable
        .combineLatest(this.now$, this.routeDate$)
        .map(([now, routeDate]) => routeDate.isSame(now, 'day'));

    Observable
      .interval(250)
      .takeUntil(this._destroy$)
      .subscribe(() => this.now$.next(moment()));
  }

  newEvent(): void {
    this._store.dispatch(eventOpenModal({} as IEvent));
  }

  private _parseDate(dateParam: string): Moment {
    if (!dateParam) {
      return moment().startOf('day');
    }

    return dateParamToDate(dateParam);
  }
}
