import { cloneDeep } from 'lodash';
import { CategoryAction, CategoryActions } from './category.actions';
import { ICategoryState } from './category.state';

const DEFAULT_STATE = {
  categories: new Map()
};

export function categoryReducer(state: ICategoryState = DEFAULT_STATE, action: CategoryAction): ICategoryState {
  switch (action.type) {
    case CategoryActions.Add:
      const categories = new Map(state.categories);
      action.categories.forEach((c) => categories.set(c.id, c));

      return {
        ...state,
        categories
      };

    default:
      return state;
  }
}
