import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { SUBCATEGORY_STATE_NAME } from './store/subcategory.state';
import { subcategoryReducer } from './store/subcategory.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SubcategoryEffects } from './store/subcategory.effects';
import { ApiModule } from '../api/api.module';
import { SubcategoryService } from './subcategory.service';

@NgModule({
  imports: [
    StoreModule.forFeature(SUBCATEGORY_STATE_NAME, subcategoryReducer),
    EffectsModule.forFeature([SubcategoryEffects]),
    ApiModule
  ],
  providers: [
    SubcategoryService
  ]
})
export class SubcategoryModule {}
