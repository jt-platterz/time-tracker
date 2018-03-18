import { AnimationEvent, trigger } from '@angular/animations';
import { Component, HostBinding, Input, Output, EventEmitter, ElementRef, Renderer2, HostListener, OnInit, OnDestroy } from '@angular/core';
import { AnimationState } from '../../animations/animation-state';
import { modalAnimation } from '../../animations/animation.helpers';

@Component({
  animations: [trigger('modalAnimation', modalAnimation)],
  selector: 'tt-modal-window',
  template: `<ng-content></ng-content>`
})
export class ModalWindowComponent implements OnInit, OnDestroy {
  @HostBinding('class') get elementClass(): string {
    return 'modalWindow';
  }

  @HostBinding('@modalAnimation') animationState: string;

  @Input() className: string;

  @Output() modalDismiss: EventEmitter<void> = new EventEmitter<void>();
  @Output() animationEnd: EventEmitter<string> = new EventEmitter<string>();

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.animationState = AnimationState.Enter;
  }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement): void {
    if (this.elementRef.nativeElement !== target) {
      return;
    }

    this.modalDismiss.emit();
  }

  @HostListener('window:keyup.esc', ['$event.target'])
  onEsc(target: HTMLElement): void {
    this.modalDismiss.emit();
  }
  
  @HostListener('@easeInOut.done', ['$event'])
  onAnimationEnd(animationEvent: AnimationEvent): void {
    this.animationEnd.emit(animationEvent.toState);
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'modalOpen');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'modalOpen');
  }

  exit(): void {
    this.animationState = AnimationState.Void;
  }
}
