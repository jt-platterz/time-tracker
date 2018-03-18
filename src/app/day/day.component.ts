import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';
import { IEvent } from '../event/event.model';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { dateParamToDate, nextDay, prevDay } from './day.helpers';
import { selectEvents, selectEventsForDate, selectModalEvent } from '../event/store/event.selectors';
import { eventRequest, eventOpenModal, eventCloseModal, eventAddEvent, eventRemoveEvent } from '../event/store/event.actions';
import { ReactiveComponent } from '../reactive-component/reactive.component';
import { Moment } from '../date/moment';
import { environment } from '../../environments/environment.prod';
import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { CableService } from '../cable/cable.service';
import { Channels } from '../cable/channel.enum';

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
    private _route: ActivatedRoute,
    private _cableService: CableService,
    private _broadcaster: Broadcaster
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
        .switchMap((date) => this._store.select(selectEventsForDate(date)))
        .takeUntil(this._destroy$);

    this.dateForEvents$
      .first()
      .subscribe((date) => {
        this._store.dispatch(eventRequest(date));
        this._cableService.subscribeToChannel(Channels.Event, {date: date.format('YYYY-MM-DD')});

        const cableEvents = this._broadcaster
          .on<any>('EventChannel')
          .takeUntil(this._destroy$);

        cableEvents
          .filter((e) => e.type !== 'destroy')
          .subscribe((cableEvent) => this._store.dispatch(eventAddEvent(cableEvent.event)));

        cableEvents
          .filter((e) => e.type === 'destroy')
          .subscribe((cableEvent) => this._store.dispatch(eventRemoveEvent(cableEvent.event_id)));
      });

    this._destroy$
      .subscribe(() => this._cableService.unsubscribe());
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
