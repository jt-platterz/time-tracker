import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { IEvent } from './event.model';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { selectEvent } from './store/event.selectors';
import { ICategory } from '../category/category.model';
import { selectCategory } from '../category/store/category.selectors';
import { lightenColor, transparentize } from './colors';
import * as moment from 'moment';
import { ReactiveComponent } from '../reactive-component/reactive.component';
import { eventDelete, eventOpenModal } from './store/event.actions';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'tt-event',
  styleUrls: ['./event.component.scss'],
  templateUrl: './event.component.html'
})
export class EventComponent extends ReactiveComponent implements OnInit {
  @Input() eventID: number;

  event$: Observable<IEvent>;
  category$: Observable<ICategory>;
  lightColor$: Observable<string>;
  mainColor$: Observable<string>;
  time$: Observable<string>;

  constructor(
    private _store: Store<IAppState>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.event$ =
      this._store
        .select(selectEvent(this.eventID))
        .filter((event) => event != null)
        .takeUntil(this._destroy$)
        .shareReplay(1);

    this.category$ =
      this.event$
        .switchMap((event) => this._store.select(selectCategory(event.category_id)))
        .takeUntil(this._destroy$)
        .shareReplay(1);

    this.mainColor$ =
      this.category$
        .filter((category) => category != null)
        .map((category) => `#${category.color}`)
        .takeUntil(this._destroy$)
        .shareReplay(1);

    this.lightColor$ =
      this.category$
        .filter((category) => category != null)
        .map((category) => transparentize(category.color, 90))
        .takeUntil(this._destroy$)
        .shareReplay(1);

    this.time$ =
      this.event$
        .filter((event) => event != null)
        .map((event) => moment(event.datetime))
        .map((time) => time.format('h:mm A'))
        .takeUntil(this._destroy$)
        .shareReplay(1);
  }

  deleteEvent(): void {
    this.event$
      .take(1)
      .subscribe((event) => this._store.dispatch(eventDelete(event)));
  }

  editEvent(): void {
    this.event$
      .take(1)
      .subscribe((event) => this._store.dispatch(eventOpenModal(event)));
  }
}
