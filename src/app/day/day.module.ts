import { NgModule } from '@angular/core';
import { DayComponent } from './day.component';
import { DayGuard } from './day.guard';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventModule } from '../event/event.module';
import { DaySidebarComponent } from './day-sidebar/day-sidebar.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    DayComponent,
    DaySidebarComponent
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
    AngularFontAwesomeModule,
    EventModule
  ]
})
export class DayModule {}
