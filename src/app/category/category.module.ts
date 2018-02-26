import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CATEGORY_STATE_NAME } from './store/category.state';
import { categoryReducer } from './store/category.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(CATEGORY_STATE_NAME, categoryReducer)
  ]
})
export class CategoryModule {}
