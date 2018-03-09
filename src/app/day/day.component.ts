import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { IEvent } from '../event/event.model';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { dateParamToDate, nextDay, prevDay } from './day.helpers';
import { selectEvents, selectEventsForDate, selectModalEvent } from '../event/store/event.selectors';
import { eventRequest, eventOpenModal, eventCloseModal } from '../event/store/event.actions';
import { ReactiveComponent } from '../reactive-component/reactive.component';
import { Moment } from '../date/moment';

const TODAY = 'today';

@Component({
  selector: 'tt-day',
  styleUrls: ['./day.component.scss'],
  templateUrl: './day.component.html'
})
export class DayComponent extends ReactiveComponent implements OnInit, OnDestroy {
  now$: BehaviorSubject<Moment> = new BehaviorSubject<Moment>(moment());
  routeParam$: Observable<string>;
  routeDate$: Observable<Moment>;
  dateForEvents$: Observable<Moment>;
  events$: Observable<number[]>;

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
        .map(this._parseDate)
        .takeUntil(this._destroy$);

    Observable
      .interval(10000)
      .takeUntil(this._destroy$)
      .subscribe(() => this.now$.next(moment()));

    this.dateForEvents$ =
      Observable
        .combineLatest(this.routeParam$, this.routeDate$, this.now$)
        .map(([routeParam, routeDate, now]) => !!routeParam ? routeDate : now)
        .takeUntil(this._destroy$);

    this.events$ =
      this.dateForEvents$
        .do((date) => this._store.dispatch(eventRequest(date)))
        .switchMap((date) => this._store.select(selectEventsForDate(date)))
        .takeUntil(this._destroy$);
  }

  addEvent(): void {
    this._store.dispatch(eventOpenModal({} as IEvent));
  }

  private _parseDate(dateParam: string): moment.Moment {
    if (!dateParam) {
      return moment().startOf('day');
    }

    return dateParamToDate(dateParam);
  }
}
