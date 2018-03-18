import { ModuleWithProviders, NgModule } from '@angular/core';
import { ModalWindowComponent } from './modal-window/modal-window.component';
import { ModalService } from './modal.service';
import { ModalStack } from './modal-stack';

@NgModule({
  declarations: [
    ModalWindowComponent
  ],
  entryComponents: [
    ModalWindowComponent
  ],
  providers: [
    ModalService
  ]
})
export class ModalModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ModalModule, providers: [ModalService, ModalStack]
    };
  }
}
