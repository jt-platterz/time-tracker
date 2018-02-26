import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { SubcategoryAction, ISubcategoryRequestAction, SubcategoryActions, subcategoryRequestSuccess, ISubcategoryRequestSuccessAction } from './subcategory.actions';
import { switchMap } from 'rxjs/operators';
import { SubcategoryService } from '../subcategory.service';
import { Observable } from 'rxjs/Rx';
import { uniqBy } from 'lodash';
import { CategoryAction, categoryAdd } from '../../category/store/category.actions';

@Injectable()
export class SubcategoryEffects {
  constructor(
    private _actions: Actions,
    private _subcategoryService: SubcategoryService
  ) {}

  @Effect()
  requestSubcategories(): Observable<SubcategoryAction> {
    return this._actions
      .ofType<ISubcategoryRequestAction>(SubcategoryActions.Request)
      .switchMap((action) => {
        return this._subcategoryService
          .list()
          .map((subcategories) => subcategoryRequestSuccess(subcategories))
          .catch(() => [subcategoryRequestSuccess([])]);
      });
  }

  @Effect()
  populateCategories(): Observable<CategoryAction> {
    return this._actions
      .ofType<ISubcategoryRequestSuccessAction>(SubcategoryActions.RequestSuccess)
      .map((action) => {
        const categories = action.subcategories.map((s) => s.category);

        return categoryAdd(uniqBy(categories, 'id'));
      });
  }
}
