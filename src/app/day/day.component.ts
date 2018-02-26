import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { IEvent } from '../event/event.model';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { dateParamToDate, nextDay, prevDay } from './day.helpers';
import { selectEvents, selectEventsForDate, selectModalEvent } from '../event/store/event.selectors';
import { eventRequest, eventCreate, eventOpenModal, eventCloseModal } from '../event/store/event.actions';

const TODAY = 'today';

@Component({
  selector: 'tt-day',
  styleUrls: ['./day.component.scss'],
  templateUrl: './day.component.html'
})
export class DayComponent implements OnInit, OnDestroy {
  day$: Observable<string>;
  events$: Observable<number[]>;
  date$: Observable<moment.Moment>;
  nextDay$: Observable<string>;
  prevDay$: Observable<string>;
  now$: BehaviorSubject<moment.Moment> = new BehaviorSubject<moment.Moment>(moment());

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _store: Store<IAppState>,
    private _route: ActivatedRoute
  ) {}

  @HostListener('click', ['$event'])
  onClick(e: MouseEvent): void {
    this._store
      .select(selectModalEvent)
      .first()
      .filter((event) => event != null)
      .subscribe((event) => {
        e.preventDefault();
        e.stopPropagation();

        this._store.dispatch(eventCloseModal());
      });
  }

  ngOnInit(): void {
    Observable
      .interval(10000)
      .takeUntil(this._destroy$)
      .subscribe(() => this.now$.next(moment()));

    console.warn('ngOnInit');
    const dateObs = this._route.params.map((p) => p.date).map(this._parseDate);

    this.date$ = Observable
      .combineLatest(this.now$, dateObs)
      .map(([now, routeDate]) => routeDate || now.startOf('day'))
      .takeUntil(this._destroy$);

    this.events$ =
      this.date$
        .do((date) => this._store.dispatch(eventRequest(date)))
        .switchMap((date) => this._store.select(selectEventsForDate(date)));

    this.nextDay$ =
      this.date$
        .map((date) => nextDay(date));

    this.prevDay$ =
      this.date$
        .map((date) => prevDay(date));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  newEvent(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this._store.dispatch(eventOpenModal({} as IEvent));
  }

  private _parseDate(dateParam: string): moment.Moment {
    if (!dateParam) {
      return moment().startOf('day');
    }

    return dateParamToDate(dateParam);
  }
}
