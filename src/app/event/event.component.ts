import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { IEvent } from './event.model';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { selectEvent } from './store/event.selectors';
import { ISubcategory } from '../subcategory/subcategory.model';
import { selectSubcategories, selectSubcategory } from '../subcategory/store/subcategory.selectors';
import { ICategory } from '../category/category.model';
import { selectCategory } from '../category/store/category.selectors';
import { lightenColor, transparentize } from './colors';
import * as moment from 'moment';

@Component({
  selector: 'tt-event',
  styleUrls: ['./event.component.scss'],
  templateUrl: './event.component.html'
})
export class EventComponent implements OnInit, OnDestroy {
  @Input() eventID: number;

  event$: Observable<IEvent>;
  category$: Observable<ICategory>;
  subcategory$: Observable<ISubcategory>;
  borderBgColor$: Observable<string>;
  mainBgColor$: Observable<string>;
  time$: Observable<string>;

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _store: Store<IAppState>,
  ) {}

  ngOnInit(): void {
    this.event$ =
      this._store
        .select(selectEvent(this.eventID))
        .takeUntil(this._destroy$);

    this.subcategory$ =
      this.event$
        .switchMap((event) => this._store.select(selectSubcategory(event.subcategory_id)));

    this.category$ =
      this.subcategory$
        .filter((subcategory) => subcategory != null)
        .switchMap((subcategory) => this._store.select(selectCategory(subcategory.category_id)));

    this.borderBgColor$ =
      this.category$
        .filter((category) => category != null)
        .map((category) => `#${category.color}`);

    this.mainBgColor$ =
      this.category$
        .filter((category) => category != null)
        .map((category) => transparentize(category.color, 90));

    this.time$ =
      this.event$
        .filter((event) => event != null)
        .map((event) => moment(event.datetime))
        .map((time) => time.format('h:mm A'));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
