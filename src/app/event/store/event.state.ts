import { IEvent } from '../event.model';

export const EVENT_STATE_NAME = 'event';

export type DailyEvents = Map<number, number[]>;
export type MonthlyEvents = Map<number, DailyEvents>;
export type YearlyEvents = Map<number, MonthlyEvents>;

export interface IEventState {
  events: Map<number, IEvent>;
  eventGroups: YearlyEvents;
  modal: IEvent;
}
