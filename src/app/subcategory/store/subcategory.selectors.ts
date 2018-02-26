import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SUBCATEGORY_STATE_NAME, ISubcategoryState } from './subcategory.state';
import { compact } from 'lodash';

export const selectSubcategoryFeature = createFeatureSelector<ISubcategoryState>(SUBCATEGORY_STATE_NAME);

export const selectSubcategory = (id: number) =>
  createSelector(selectSubcategoryFeature, (state) => state.subcategories.get(id));


export const selectSubcategories = (ids: number[]) =>
  createSelector(selectSubcategoryFeature, (state) => {
    if (!ids) {
      return [];
    }

    return compact(ids.map((id) => state.subcategories.get(id)));
  });

export const selectSubcategoriesByCategory = (catID: number) =>
  createSelector(selectSubcategoryFeature, (state) => state.subsByCategoryID.get(catID));
