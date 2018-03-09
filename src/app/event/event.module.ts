import { NgModule } from '@angular/core';
import { EventService } from './event.service';
import { StoreModule } from '@ngrx/store';
import { eventReducer } from './store/event.reducers';
import { EVENT_STATE_NAME } from '../store/app.state';
import { EffectsModule } from '@ngrx/effects';
import { EventEffects } from './store/event.effects';
import { EventComponent } from './event.component';
import { CommonModule } from '@angular/common';
import { EventModalComponent } from './event-modal/event-modal.component';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    EventComponent,
    EventModalComponent
  ],
  exports: [
    EventComponent,
    EventModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature(EVENT_STATE_NAME, eventReducer),
    EffectsModule.forFeature([EventEffects]),
    AngularFontAwesomeModule
  ],
  providers: [
    EventService
  ]
})
export class EventModule {}
