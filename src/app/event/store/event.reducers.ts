import { IEventState, YearlyEvents } from './event.state';
import { EventAction, EventActions, IEventRequestSuccessAction, IEventDeleteSuccessAction } from './event.actions';
import { cloneDeep, sortBy } from 'lodash';
import * as moment from 'moment';
import { IEvent } from '../event.model';

const DEFAULT_STATE = {
  events: new Map(),
  eventGroups: new Map(),
  modal: null
};

export function eventReducer(state: IEventState = DEFAULT_STATE, action: EventAction): IEventState {
  let newEvents: Map<number, IEvent>;

  switch (action.type) {
    case EventActions.RequestSuccess:
      newEvents = new Map(cloneDeep(state.events));
      action.events.forEach((e) => newEvents.set(e.id, e));

      return {
        ...state,
        events: newEvents,
        eventGroups: _buildEventGroups(action, state)
      };

    case EventActions.OpenModal:
      return {
        ...state,
        modal: cloneDeep(action.event)
      };

    case EventActions.CloseModal:
      return {
        ...state,
        modal: null
      };

    case EventActions.DeleteSuccess:
      newEvents = new Map(state.events);
      newEvents.delete(action.event.id);

      return {
        ...state,
        events: cloneDeep(newEvents)
      };

    default:
      return state;
  }
}

function _buildEventGroups(action: IEventRequestSuccessAction, state: IEventState): YearlyEvents {
  const newGroups = new Map(state.eventGroups);

  let newYearMap = newGroups.get(action.date.year());
  if (!newYearMap) {
    newYearMap = new Map();
  }

  let newMonthMap = newYearMap.get(action.date.month());
  if (!newMonthMap) {
    newMonthMap = new Map();
  }

  newMonthMap.set(action.date.date(), sortBy(action.events, (e) => -moment(e.datetime).unix()).map((e) => e.id));
  newYearMap.set(action.date.month() + 1, newMonthMap);
  newGroups.set(action.date.year(), newYearMap);

  return cloneDeep(newGroups);
}
