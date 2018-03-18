import * as moment from 'moment';
import { IEvent } from '../event.model';

export enum EventActions {
  Request = '[EVENT] Request',
  RequestSuccess = '[EVENT] Request Success',
  Save = '[EVENT] Save',
  SaveSuccess = '[EVENT] Save Success',
  SaveFailure = '[EVENT] Save Failure',
  OpenModal = '[EVENT] Open Modal',
  CloseModal = '[EVENT] Close Modal',
  Delete = '[EVENT] Delete Request',
  DeleteSuccess = '[EVENT] Delete Success',
  DeleteFailure = '[EVENT] Delete Failure',
  AddEvent = '[EVENT] Add Event',
  RemoveEvent = '[EVENT] Remove Event'
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

export interface IEventSaveAction {
  type: EventActions.Save;
  event: Partial<IEvent>;
}
export function eventSave(event: Partial<IEvent>): IEventSaveAction {
  return {event, type: EventActions.Save};
}

export interface IEventSaveSuccessAction {
  type: EventActions.SaveSuccess;
  event: IEvent;
}
export function eventSaveSuccess(event: IEvent): IEventSaveSuccessAction {
  return {event, type: EventActions.SaveSuccess};
}

export interface IEventSaveFailureAction {
  type: EventActions.SaveFailure;
  errors: any;
}
export function eventSaveFailure(errors: any): IEventSaveFailureAction {
  return {errors, type: EventActions.SaveFailure};
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

export interface IEventDeleteAction {
  type: EventActions.Delete;
  event: IEvent;
}
export function eventDelete(event: IEvent): IEventDeleteAction {
  return {event, type: EventActions.Delete};
}

export interface IEventDeleteSuccessAction {
  type: EventActions.DeleteSuccess;
  event: IEvent;
}
export function eventDeleteSuccess(event: IEvent): IEventDeleteSuccessAction {
  return {event, type: EventActions.DeleteSuccess};
}

export interface IEventDeleteFailureAction {
  type: EventActions.DeleteFailure;
  errors: any;
}
export function eventDeleteFailure(errors: any): IEventDeleteFailureAction {
  return {errors, type: EventActions.DeleteFailure};
}

export interface IEventAddEventAction {
  type: EventActions.AddEvent;
  event: IEvent;
}
export function eventAddEvent(event: IEvent): IEventAddEventAction {
  return {event, type: EventActions.AddEvent};
}

export interface IEventRemoveEventAction {
  type: EventActions.RemoveEvent;
  eventID: number;
}
export function eventRemoveEvent(eventID: number): IEventRemoveEventAction {
  return {eventID, type: EventActions.RemoveEvent};
}

export type EventAction
  = IEventRequestAction
  | IEventRequestSuccessAction
  | IEventSaveAction
  | IEventSaveSuccessAction
  | IEventSaveFailureAction
  | IEventOpenModalAction
  | IEventCloseModalAction
  | IEventDeleteAction
  | IEventDeleteSuccessAction
  | IEventDeleteFailureAction
  | IEventAddEventAction
  | IEventRemoveEventAction;

