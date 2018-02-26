import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { EventService } from '../event.service';
import { Observable } from 'rxjs/Rx';
import { EventActions, IEventRequestAction, eventRequestSuccess, EventAction, IEventCreateAction, eventCreateSuccess, eventCreateFailure, IEventCreateSuccessAction, eventRequest, eventCloseModal } from './event.actions';
import * as moment from 'moment';

@Injectable()
export class EventEffects {
  constructor(
    private _actions: Actions,
    private _eventService: EventService
  ) {}

  @Effect()
  requestEvents(): Observable<EventAction> {
    return this._actions
      .ofType<IEventRequestAction>(EventActions.Request)
      .mergeMap((action) => {
        return this._eventService
          .list(action.date)
          .map((events) => eventRequestSuccess(action.date, events));
      });
  }

  @Effect()
  createEvent(): Observable<EventAction> {
    return this._actions
      .ofType<IEventCreateAction>(EventActions.Create)
      .concatMap((action) => {
        return this._eventService
          .create(action.event)
          .map((event) => eventCreateSuccess(event))
          .catch((errors) => [eventCreateFailure(errors)]);
      });
  }

  @Effect()
  refetchEvents(): Observable<EventAction> {
  return this._actions
    .ofType<IEventCreateSuccessAction>(EventActions.CreateSuccess)
    .map((action) => eventRequest(moment(action.event.datetime)));
  }

  @Effect()
  closeModal(): Observable<EventAction> {
  return this._actions
    .ofType<IEventCreateSuccessAction>(EventActions.CreateSuccess)
    .map((action) => eventCloseModal());
  }
}
