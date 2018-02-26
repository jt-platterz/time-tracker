import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IEventState, EVENT_STATE_NAME } from './event.state';
import * as moment from 'moment';
import { compact } from 'lodash';

export const selectEventFeature = createFeatureSelector<IEventState>(EVENT_STATE_NAME);

export const selectEventsForDate = (date: moment.Moment) =>
  createSelector(selectEventFeature, (state) => {
    const year = state.eventGroups.get(date.year());
    if (!year) { return []; }

    const month = year.get(date.month() + 1);
    if (!month) { return []; }

    return month.get(date.date()) || [];
  });

export const selectEvents = (ids: number[]) =>
  createSelector(selectEventFeature, (state) => {
    if (!ids) { return []; }

    return compact(ids.map((id) => state.events.get(id)));
  });

export const selectEvent = (id: number) =>
  createSelector(selectEventFeature, (state) => state.events.get(id));

export const selectModalEvent = createSelector(selectEventFeature, (state) => state.modal);
