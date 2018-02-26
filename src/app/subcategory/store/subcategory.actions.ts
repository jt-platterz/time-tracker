import { ISubcategory } from '../subcategory.model';

export enum SubcategoryActions {
  Request = '[SUBCATEGORY] Request',
  RequestSuccess = '[SUBCATEGORY] Request Success'
}

export interface ISubcategoryRequestAction {
  type: SubcategoryActions.Request;
}
export function subcategoryRequest(): ISubcategoryRequestAction {
  return { type: SubcategoryActions.Request };
}

export interface ISubcategoryRequestSuccessAction {
  type: SubcategoryActions.RequestSuccess;
  subcategories: ISubcategory[];
}
export function subcategoryRequestSuccess(subcategories: ISubcategory[]): ISubcategoryRequestSuccessAction {
  return { subcategories, type: SubcategoryActions.RequestSuccess };
}

export type SubcategoryAction
  = ISubcategoryRequestAction
  | ISubcategoryRequestSuccessAction;
