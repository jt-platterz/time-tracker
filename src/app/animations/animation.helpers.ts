
import { animate, style, transition } from '@angular/animations';

export const modalAnimation = [
  transition(':enter', [
    style({transform: 'translateY(-100%) translateX(-50%)'}),
    animate('300ms ease', style({transform: 'translateY(0) translateX(-50%)'}))
  ]),
  transition(':leave', [
    style({transform: 'translateY(0) translateX(-50%)'}),
    animate('300ms ease', style({transform: 'translateY(-100%) translateX(-50%)'}))
  ])
];
