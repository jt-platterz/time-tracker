import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  exports: [
    NavbarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class NavbarModule {}
