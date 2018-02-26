import { NgModule } from '@angular/core';
import { DayComponent } from './day.component';
import { DayGuard } from './day.guard';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventModule } from '../event/event.module';

@NgModule({
  declarations: [
    DayComponent
  ],
  exports: [
    DayComponent
  ],
  providers: [
    DayGuard
  ],
  imports: [
    CommonModule,
    RouterModule,
    EventModule
  ]
})
export class DayModule {}
