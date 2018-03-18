import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { EventService } from '../event.service';
import { Observable } from 'rxjs/Rx';
import {
  EventActions,
  IEventRequestAction,
  eventRequestSuccess,
  EventAction,
  IEventSaveAction,
  eventSaveSuccess,
  eventSaveFailure,
  IEventSaveSuccessAction,
  eventRequest,
  eventCloseModal,
  IEventDeleteAction,
  eventDelete,
  eventDeleteFailure,
  eventDeleteSuccess,
  IEventDeleteSuccessAction } from './event.actions';
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
      .ofType<IEventSaveAction>(EventActions.Save)
      .concatMap((action) => {
        return this._eventService
          .save(action.event)
          .map((event) => eventSaveSuccess(event))
          .catch((errors) => [eventSaveFailure(errors)]);
      });
  }

  @Effect()
  deleteEvent(): Observable<EventAction> {
    return this._actions
      .ofType<IEventDeleteAction>(EventActions.Delete)
      .mergeMap((action) => {
        return this._eventService.delete(action.event.id)
          .map(() => eventDeleteSuccess(action.event))
          .catch(() => [eventDeleteFailure('Could not delete')]);
      });
  }

  @Effect()
  closeModal(): Observable<EventAction> {
  return this._actions
    .ofType<IEventSaveSuccessAction>(EventActions.SaveSuccess)
    .map((action) => eventCloseModal());
  }
}
