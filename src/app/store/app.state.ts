import { ICategoryState } from '../category/store/category.state';
import { IEventState } from '../event/store/event.state';
import { IAuthState } from '../auth/store/auth.state';

export const SUBCATEGORY_STATE_NAME = 'subcategory';
export const EVENT_STATE_NAME = 'event';

export interface IAppState {
  auth?: IAuthState;
  category?: ICategoryState;
  events?: IEventState;
}
