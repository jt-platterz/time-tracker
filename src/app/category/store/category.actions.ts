import { ICategory } from '../category.model';
export enum CategoryActions {
  Add = '[CATEGORY] Add'
}

export interface ICategoryAddAction {
  type: CategoryActions.Add;
  categories: ICategory[];
}
export function categoryAdd(categories: ICategory[]): ICategoryAddAction {
  return {categories, type: CategoryActions.Add};
}

export type CategoryAction
  = ICategoryAddAction;
