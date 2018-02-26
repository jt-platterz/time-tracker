import { ICategory } from '../category/category.model';

export interface ISubcategory {
  id: number;
  title: string;
  category: ICategory;
  category_id: number;
}
