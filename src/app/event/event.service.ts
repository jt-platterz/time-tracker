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

  create(event: Partial<IEvent>): Observable<IEvent> {
    return this._api
      .post('events', {event})
      .map((response) => response.event);
  }
}
