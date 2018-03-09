import { omit, uniq, cloneDeep } from 'lodash';
import { ICategory } from '../category.model';
import { ICategoryState } from './category.state';
import { CategoryAction, CategoryActions } from './category.actions';

const DEFAULT_STATE = {
  categories: new Map(),
  subsByCategoryID: new Map()
};

export function categoryReducer(
  state: ICategoryState = DEFAULT_STATE,
  action: CategoryAction
): ICategoryState {
  switch (action.type) {
    case CategoryActions.RequestSuccess:
      const newCategories = new Map<number, ICategory>(cloneDeep(state.categories));
      action.categories.forEach((c) => newCategories.set(c.id, c));

      return {
        ...state,
        categories: newCategories
      };

    default:
      return state;
  }
}
