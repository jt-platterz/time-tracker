import { ComponentRef } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs/Rx';

import { AnimationState } from '../animations/animation-state';

import { ContentRef } from './content-ref';
import { ModalWindowComponent } from './modal-window/modal-window.component';

import { IModalShowable } from './modal-showable';

export class ModalRef {
  private _windowDismissSubscription: Subscription;
  private _windowInstanceSubscription: Subscription;

  private _beforeCloseSubject: Subject<any>;
  private _beforeDismissSubject: Subject<any>;
  private _afterCloseSubject: Subject<any>;
  private _afterDismissSubject: Subject<any>;

  private _closeData: any;
  private _dismissData: any;

  constructor(
    private windowComponentReference: ComponentRef<ModalWindowComponent>,
    private contentRef: ContentRef) {
    this._initSubjects();

    this._windowDismissSubscription = this._windowInstance.modalDismiss.subscribe(() => {
      this.dismiss();
    });

    this._windowInstanceSubscription = this._windowInstance.animationEnd.subscribe((state) => {
      if (state === AnimationState.Void) {
        this._onDestroy();
      }
    });

    if (this.componentInstance && this.componentInstance.closed) {
      this.componentInstance.closed.subscribe(() => this._onDestroy());
    }
  }

  get beforeClose(): Observable<any> {
    return this._beforeCloseSubject.asObservable();
  }

  get beforeDismiss(): Observable<any> {
    return this._beforeDismissSubject.asObservable();
  }

  get afterClose(): Observable<any> {
    return this._afterCloseSubject.asObservable();
  }

  get afterDismiss(): Observable<any> {
    return this._afterDismissSubject.asObservable();
  }

  get componentInstance(): IModalShowable {
    return this.contentRef.componentRef && this.contentRef.componentRef.instance;
  }

  close(data?: any): void {
    if (!this.windowComponentReference) {
      return;
    }

    this._closeData = data;
    this._beforeCloseSubject.next(this._closeData);
    this._destroy();
  }

  dismiss(data: any = {}): void {
    if (!this.windowComponentReference) {
      return;
    }

    this._dismissData = data;
    this._beforeDismissSubject.next(this._dismissData);
    this._destroy();
  }

  private _initSubjects(): void {
    this._beforeCloseSubject = new Subject<any>();
    this._beforeDismissSubject = new Subject<any>();
    this._afterCloseSubject = new Subject<any>();
    this._afterDismissSubject = new Subject<any>();
  }

  private get _windowInstance(): ModalWindowComponent {
    return this.windowComponentReference.instance;
  }

  private _destroy(): void {
    if (this.componentInstance && this.componentInstance.closed) {
      this.contentRef.componentRef.destroy();
    } else {
      this._windowInstance.exit();
    }
  }

  private _onDestroy(): void {
    this.windowComponentReference.destroy();

    if (this._closeData) {
      this._afterCloseSubject.next(this._closeData);
    } else if (this._dismissData) {
      this._afterDismissSubject.next(this._dismissData);
    }

    this._windowInstanceSubscription.unsubscribe();
    this._windowDismissSubscription.unsubscribe();

    this._beforeDismissSubject.complete();
    this._beforeCloseSubject.complete();

    this._afterCloseSubject.complete();
    this._afterDismissSubject.complete();

    this.contentRef.componentRef.destroy();

    this.windowComponentReference = this.contentRef =
      this._beforeCloseSubject = this._beforeDismissSubject =
      this._windowInstanceSubscription = this._windowDismissSubscription =
      this._afterDismissSubject = this._afterCloseSubject = null;
  }
}
