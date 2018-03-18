import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  ReflectiveInjector,
  Type
} from '@angular/core';
import { isString } from 'lodash';

import { ActiveModal } from './active-modal';
import { ContentRef } from './content-ref';
import { ModalRef } from './modal-ref';
import { ModalWindowComponent } from './modal-window/modal-window.component';

@Injectable()
export class ModalStack {
  private _windowFactory: ComponentFactory<ModalWindowComponent>;

  constructor(
    private _applicationRef: ApplicationRef,
    private _injector: Injector,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {
    this._windowFactory = _componentFactoryResolver.resolveComponentFactory(ModalWindowComponent);
  }

  open(
    componentFactoryResolver: ComponentFactoryResolver,
    contentInjector: Injector,
    content: Type<any>,
    data: any): ModalRef {
    const activeModal = new ActiveModal();

    const contentComponentFactory = componentFactoryResolver.resolveComponentFactory(content);
    const modalContentInjector = ReflectiveInjector.resolveAndCreate(
      [
        { provide: ActiveModal, useValue: activeModal }
      ],
      contentInjector);
    const componentRef = contentComponentFactory.create(modalContentInjector);
    this._applicationRef.attachView(componentRef.hostView);
    const contentRef = new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
    Object.keys(data).map((key: string) => componentRef.instance[key] = data[key]);

    const className: string = componentRef.location.nativeElement.tagName.toLowerCase().split('-')
      .map((word: string, wordIndex: number) =>
        wordIndex === 0 && word || word.split('').map((letter: string, letterIndex: number) =>
          letterIndex === 0 && letter.toUpperCase() || letter).join('')).join('');

    const windowComponentReference = this._windowFactory.create(this._injector, contentRef.nodes);
    windowComponentReference.instance.className = className;
    this._applicationRef.attachView(windowComponentReference.hostView);
    document.body.appendChild(windowComponentReference.location.nativeElement);

    const modalRef = new ModalRef(windowComponentReference, contentRef);

    activeModal.close = (response: any) => {
      modalRef.close(response);
    };

    activeModal.dismiss = (response: any) => {
      modalRef.dismiss(response);
    };

    return modalRef;
  }
}
