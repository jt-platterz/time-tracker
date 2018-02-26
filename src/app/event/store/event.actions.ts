import * as moment from 'moment';
import { IEvent } from '../event.model';

export enum EventActions {
  Request = '[EVENT] Request',
  RequestSuccess = '[EVENT] Request Success',
  Create = '[EVENT] Create',
  CreateSuccess = '[EVENT] Create Success',
  CreateFailure = '[EVENT] Create Failure',
  OpenModal = '[EVENT] Open Modal',
  CloseModal = '[EVENT] Close Modal'
}

export interface IEventRequestAction {
  type: EventActions.Request;
  date: moment.Moment;
}
export function eventRequest(date: moment.Moment): IEventRequestAction {
  return {date, type: EventActions.Request};
}

export interface IEventRequestSuccessAction {
  type: EventActions.RequestSuccess;
  date: moment.Moment;
  events: IEvent[];
}
export function eventRequestSuccess(date: moment.Moment, events: IEvent[]): IEventRequestSuccessAction {
  return {date, events, type: EventActions.RequestSuccess};
}

export interface IEventCreateAction {
  type: EventActions.Create;
  event: Partial<IEvent>;
}
export function eventCreate(event: Partial<IEvent>): IEventCreateAction {
  return {event, type: EventActions.Create};
}

export interface IEventCreateSuccessAction {
  type: EventActions.CreateSuccess;
  event: IEvent;
}
export function eventCreateSuccess(event: IEvent): IEventCreateSuccessAction {
  return {event, type: EventActions.CreateSuccess};
}

export interface IEventCreateFailureAction {
  type: EventActions.CreateSuccess;
  errors: any;
}
export function eventCreateFailure(errors: any): IEventCreateFailureAction {
  return {errors, type: EventActions.CreateSuccess};
}

export interface IEventOpenModalAction {
  type: EventActions.OpenModal;
  event: IEvent;
}
export function eventOpenModal(event: IEvent): IEventOpenModalAction {
  return {event, type: EventActions.OpenModal};
}

export interface IEventCloseModalAction {
  type: EventActions.CloseModal;
}
export function eventCloseModal(): IEventCloseModalAction {
  return {type: EventActions.CloseModal};
}

export type EventAction
  = IEventRequestAction
  | IEventRequestSuccessAction
  | IEventCreateAction
  | IEventCreateSuccessAction
  | IEventCreateFailureAction
  | IEventOpenModalAction
  | IEventCloseModalAction;

