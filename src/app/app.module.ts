import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CategoryModule } from './category/category.module';

import { AppComponent } from './app.component';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { SubcategoryEffects } from './subcategory/store/subcategory.effects';
import { EventModule } from './event/event.module';
import { DayModule } from './day/day.module';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({ maxAge: 50 }),
    EffectsModule.forRoot([]),
    RouterModule.forRoot(appRoutes, {enableTracing: environment.production}),
    CategoryModule,
    SubcategoryModule,
    EventModule,
    DayModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
