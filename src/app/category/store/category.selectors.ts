import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CATEGORY_STATE_NAME, ICategoryState } from './category.state';

export const selectCategoryFeature = createFeatureSelector<ICategoryState>(CATEGORY_STATE_NAME);

export const selectCategories = 
  createSelector(selectCategoryFeature, (state) => Array.from(state.categories.values()));

export const selectCategory = (id: number) =>
  createSelector(selectCategoryFeature, (state) => state.categories && state.categories.get(id));
