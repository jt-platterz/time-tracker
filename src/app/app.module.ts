import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Ng2CableModule } from 'ng2-cable';

import { AppComponent } from './app.component';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { DayModule } from './day/day.module';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import { AuthModule } from './auth/auth.module';
import { NavbarModule } from './navbar/navbar.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ModalModule } from './modal/modal.module';
import { CableModule } from './cable/cable.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({ maxAge: 50 }),
    EffectsModule.forRoot([]),
    Ng2CableModule,
    AngularFontAwesomeModule,
    RouterModule.forRoot(appRoutes, {enableTracing: environment.production}),
    CableModule,
    NavbarModule,
    AuthModule,
    CategoryModule,
    EventModule,
    DayModule,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
