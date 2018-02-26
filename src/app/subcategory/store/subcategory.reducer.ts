import { omit, uniq } from 'lodash';
import { ISubcategory } from '../subcategory.model';
import { ISubcategoryState } from './subcategory.state';
import { SubcategoryAction, SubcategoryActions } from './subcategory.actions';

const DEFAULT_STATE = {
  subcategories: new Map(),
  subsByCategoryID: new Map()
};

export function subcategoryReducer(
  state: ISubcategoryState = DEFAULT_STATE,
  action: SubcategoryAction
): ISubcategoryState {
  switch (action.type) {
    case SubcategoryActions.RequestSuccess:
      const newSubs = new Map(state.subcategories);
      action.subcategories.forEach((s) => newSubs.set(s.id, omit(s, 'category')));

      const newCatIDs = new Map(state.subsByCategoryID);
      uniq(action.subcategories.map((s) => s.category_id))
        .forEach((catID) => {
          const ids = action.subcategories.filter((s) => s.category_id === catID).map((s) => s.id);
          newCatIDs.set(catID, ids);
        });

      return {
        ...state,
        subcategories: newSubs,
        subsByCategoryID: newCatIDs
      };

    default:
      return state;
  }
}
