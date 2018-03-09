import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CATEGORY_STATE_NAME } from './store/category.state';
import { categoryReducer } from './store/category.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CategoryEffects } from './store/category.effects';
import { CategoryService } from './category.service';

@NgModule({
  imports: [
    StoreModule.forFeature(CATEGORY_STATE_NAME, categoryReducer),
    EffectsModule.forFeature([CategoryEffects])
  ],
  providers: [
    CategoryService
  ]
})
export class CategoryModule {}
