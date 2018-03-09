import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { CategoryAction, ICategoryRequestAction, CategoryActions, categoryRequestSuccess, ICategoryRequestSuccessAction } from './category.actions';
import { Observable } from 'rxjs/Rx';
import { CategoryService } from '../category.service';


@Injectable()
export class CategoryEffects {
  constructor(
    private _actions: Actions,
    private _categoryService: CategoryService
  ) {}

  @Effect()
  requestCategories(): Observable<CategoryAction> {
    return this._actions
      .ofType<ICategoryRequestAction>(CategoryActions.Request)
      .switchMap((action) => {
        return this._categoryService
          .list()
          .map((categories) => categoryRequestSuccess(categories))
          .catch(() => [categoryRequestSuccess([])]);
      });
  }
}
