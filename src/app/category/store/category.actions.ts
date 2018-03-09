import { ICategory } from '../category.model';

export enum CategoryActions {
  Request = '[SUBCATEGORY] Request',
  RequestSuccess = '[SUBCATEGORY] Request Success'
}

export interface ICategoryRequestAction {
  type: CategoryActions.Request;
}
export function categoryRequest(): ICategoryRequestAction {
  return { type: CategoryActions.Request };
}

export interface ICategoryRequestSuccessAction {
  type: CategoryActions.RequestSuccess;
  categories: ICategory[];
}
export function categoryRequestSuccess(categories: ICategory[]): ICategoryRequestSuccessAction {
  return { categories, type: CategoryActions.RequestSuccess };
}

export type CategoryAction
  = ICategoryRequestAction
  | ICategoryRequestSuccessAction;
