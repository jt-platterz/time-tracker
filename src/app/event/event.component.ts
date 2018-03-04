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
import { ReactiveComponent } from '../reactive-component/reactive.component';

@Component({
  selector: 'tt-event',
  styleUrls: ['./event.component.scss'],
  templateUrl: './event.component.html'
})
export class EventComponent extends ReactiveComponent implements OnInit {
  @Input() eventID: number;

  event$: Observable<IEvent>;
  category$: Observable<ICategory>;
  subcategory$: Observable<ISubcategory>;
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
        .takeUntil(this._destroy$);

    this.subcategory$ =
      this.event$
        .switchMap((event) => this._store.select(selectSubcategory(event.subcategory_id)));

    this.category$ =
      this.subcategory$
        .filter((subcategory) => subcategory != null)
        .switchMap((subcategory) => this._store.select(selectCategory(subcategory.category_id)));

    this.mainColor$ =
      this.category$
        .filter((category) => category != null)
        .map((category) => `#${category.color}`);

    this.lightColor$ =
      this.category$
        .filter((category) => category != null)
        .map((category) => transparentize(category.color, 90));

    this.time$ =
      this.event$
        .filter((event) => event != null)
        .map((event) => moment(event.datetime))
        .map((time) => time.format('h:mm A'));
  }
}
