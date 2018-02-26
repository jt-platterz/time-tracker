import { ICategory } from '../category.model';

export const CATEGORY_STATE_NAME = 'category';

export interface ICategoryState {
  categories: Map<number, ICategory>;
}
