import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from './store/app.state';
import { subcategoryRequest } from './subcategory/store/subcategory.actions';
import { SubcategoryService } from './subcategory/subcategory.service';
import * as moment from 'moment';
import { eventRequest, eventCreate, eventOpenModal } from './event/store/event.actions';
import { Observable } from 'rxjs/Rx';
import { IEvent } from './event/event.model';
import { selectModalEvent } from './event/store/event.selectors';
import { cloneDeep } from 'lodash';
import { authInitialize } from './auth/store/auth.actions';
import { selectCurrentUser } from './auth/store/auth.selectors';

@Component({
  selector: 'tt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  modal$: Observable<IEvent>;

  constructor(private _store: Store<IAppState>) {}

  ngOnInit(): void {
    this._store.dispatch(authInitialize());

    this._store
      .select(selectCurrentUser)
      .filter((user) => user != null)
      .subscribe(() => this._store.dispatch(subcategoryRequest()));

    this.modal$ =
      this._store
        .select(selectModalEvent)
        .map((event) => cloneDeep(event));
  }
}
