import { ICategoryState } from '../category/store/category.state';
import { IEventState } from '../event/store/event.state';
import { ISubcategoryState } from '../subcategory/store/subcategory.state';

export const SUBCATEGORY_STATE_NAME = 'subcategory';
export const EVENT_STATE_NAME = 'event';

export interface IAppState {
  category?: ICategoryState;
  subcategories?: ISubcategoryState;
  events?: IEventState;
}
