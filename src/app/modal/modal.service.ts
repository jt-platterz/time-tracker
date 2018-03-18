import { ComponentFactoryResolver, Injectable, Injector, Type } from '@angular/core';

import { ModalRef } from './modal-ref';
import { ModalStack } from './modal-stack';

@Injectable()
export class ModalService {
  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _modalStack: ModalStack
  ) { }

  open<T>(modal: Type<T>, data: Partial<T> = {}): ModalRef {
    return this._modalStack.open(this._componentFactoryResolver, this._injector, modal, data);
  }
}
