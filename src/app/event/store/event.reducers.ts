import { IEventState, YearlyEvents, MonthlyEvents } from './event.state';
import { EventAction, EventActions, IEventRequestSuccessAction, IEventDeleteSuccessAction, IEventAddEventAction } from './event.actions';
import { cloneDeep, sortBy, uniq, compact } from 'lodash';
import * as moment from 'moment';
import { IEvent } from '../event.model';

const DEFAULT_STATE = {
  events: new Map(),
  eventGroups: new Map(),
  modal: null
};

export function eventReducer(state: IEventState = DEFAULT_STATE, action: EventAction): IEventState {
  let newEvents: Map<number, IEvent>;
  let newEventGroups: YearlyEvents;

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

      case EventActions.RemoveEvent:
        newEvents = new Map(cloneDeep(state.events));
        newEvents.delete(action.eventID);
        newEventGroups = _eventRemoved(action.eventID, state, newEvents);
  
        return {
          ...state,
          events: newEvents,
          eventGroups: newEventGroups
        };

      case EventActions.AddEvent:
        newEvents = new Map(cloneDeep(state.events));
        newEvents.set(action.event.id, action.event);
        newEventGroups = _eventAdded(action, state, newEvents);

        return {
          ...state,
          events: cloneDeep(newEvents),
          eventGroups: newEventGroups
        };

    default:
      return state;
  }
}

function _buildEventGroups(action: IEventRequestSuccessAction, state: IEventState): YearlyEvents {
  const date = action.date;
  const newYearMap = new Map<number, MonthlyEvents>(cloneDeep(state.eventGroups));
  const newMonthMap = newYearMap.get(date.year()) || new Map();
  const newDateMap = newMonthMap.get(date.month() + 1) || new Map();

  newDateMap.set(action.date.date(), sortBy(action.events, (e) => -moment(e.datetime).unix()).map((e) => e.id));
  newMonthMap.set(action.date.month() + 1, newDateMap);
  newYearMap.set(action.date.year(), newMonthMap);

  return cloneDeep(newYearMap);
}

function _eventAdded(action: IEventAddEventAction, state: IEventState, events: Map<number, IEvent>): YearlyEvents {
  const event = action.event;
  const date = moment(event.datetime);
  const newYearMap = new Map<number, MonthlyEvents>(cloneDeep(state.eventGroups));
  const newMonthMap = newYearMap.get(date.year()) || new Map();
  const newDateMap = newMonthMap.get(date.month() + 1) || new Map();

  const eventIDs = newDateMap.get(date.date());
  if (!eventIDs || !eventIDs.length) {
    newDateMap.set(date.date(), [event.id]);
  } else {
    eventIDs.push(event.id);
    newDateMap.set(date.date(), sortBy(uniq(eventIDs), (id) => -moment(events.get(id).datetime).unix()));
  }

  newMonthMap.set(date.month() + 1, newDateMap);
  newYearMap.set(date.year(), newMonthMap);

  return cloneDeep(newYearMap);
}

function _eventRemoved(eventID, state: IEventState, events: Map<number, IEvent>): YearlyEvents {
  const newYearMap = new Map<number, MonthlyEvents>(cloneDeep(state.eventGroups));

  Array.from(newYearMap.keys()).forEach((year) => {
    const newMonthMap = newYearMap.get(year);

    Array.from(newMonthMap.keys()).forEach((month) => {
      const newDateMap = newMonthMap.get(month);

      Array.from(newDateMap.keys()).forEach((date) => {
        const ids = newDateMap.get(date) || [];
        
        newDateMap.set(date, ids.filter((id) => id !== eventID));
      });

      newMonthMap.set(month, newDateMap);
    });

    newYearMap.set(year, newMonthMap);
  });

  return newYearMap;
}
