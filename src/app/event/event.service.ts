import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs/Rx';
import { IEvent } from './event.model';
import * as moment from 'moment';

@Injectable()
export class EventService {
  constructor(private _api: ApiService) {}

  list(date: moment.Moment): Observable<IEvent[]> {
    return this._api
      .get('events', {date: date.toDate()})
      .map((response) => response.events);
  }

  save(event: Partial<IEvent>): Observable<IEvent> {
    return event.id ? this._update(event) : this._create(event);
  }

  delete(eventID: number): Observable<number> {
    return this._api
      .delete(`events/${eventID}`)
      .map(() => eventID);
  }

  private _create(event: Partial<IEvent>): Observable<IEvent> {
    return this._api
      .post('events', {event})
      .map((response) => response.event);
  }

  private _update(event: Partial<IEvent>): Observable<IEvent> {
    return this._api
      .patch(`events/${event.id}`, {event})
      .map((response) => response.event);
  }
}
