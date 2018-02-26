import { ISubcategory } from '../subcategory.model';

export const SUBCATEGORY_STATE_NAME = 'subcategory';

export interface ISubcategoryState {
  subcategories: Map<number, ISubcategory>;
  subsByCategoryID: Map<number, number[]>;
}
