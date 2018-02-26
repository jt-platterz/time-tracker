import { IEventState, YearlyEvents } from './event.state';
import { EventAction, EventActions, IEventRequestSuccessAction } from './event.actions';
import { cloneDeep, sortBy } from 'lodash';
import * as moment from 'moment';

const DEFAULT_STATE = {
  events: new Map(),
  eventGroups: new Map(),
  modal: null
};

export function eventReducer(state: IEventState = DEFAULT_STATE, action: EventAction): IEventState {
  switch (action.type) {
    case EventActions.RequestSuccess:
      const newEvents = new Map(state.events);
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

  return newGroups;
}
