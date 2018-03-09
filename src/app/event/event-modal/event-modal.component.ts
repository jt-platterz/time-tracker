import { animate, trigger, transition, style } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { IEvent } from '../event.model';
import { cloneDeep } from 'lodash';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/app.state';
import { eventSave, eventOpenModal, eventCloseModal } from '../store/event.actions';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { ICategory } from '../../category/category.model';
import { selectCategories, selectCategory } from '../../category/store/category.selectors';
import { ReactiveComponent } from '../../reactive-component/reactive.component';
import { selectModalEvent } from '../store/event.selectors';

@Component({
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({transform: 'translateY(-100%) translateX(-50%)'}),
        animate('300ms ease', style({transform: 'translateY(0) translateX(-50%)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0) translateX(-50%)'}),
        animate('300ms ease', style({transform: 'translateY(-100%) translateX(-50%)'}))
      ])
    ]),
    trigger('modalBackdropAnimation', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms ease', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('300ms ease', style({opacity: 0}))
      ])
    ])
  ],
  selector: 'tt-event-modal',
  styleUrls: ['./event-modal.component.scss'],
  templateUrl: './event-modal.component.html'
})
export class EventModalComponent extends ReactiveComponent implements AfterViewInit, OnInit, OnDestroy {
  event$: Observable<IEvent>;
  categories$: Observable<ICategory[]>;
  selectedCategory$: BehaviorSubject<ICategory> = new BehaviorSubject<ICategory>(null);

  @ViewChild('titleInput') titleInput: ElementRef;

  private _event: IEvent;

  constructor(private _store: Store<IAppState>) {
    super();
  }

  ngOnInit(): void {
    this.event$ =
      this._store
        .select(selectModalEvent)
        .map((event) => cloneDeep(event));

    this.categories$ =
      this._store
        .select(selectCategories)
        .takeUntil(this._destroy$);
  }

  ngAfterViewInit(): void {
    Observable
      .combineLatest(this.event$, this.categories$)
      .filter(([event, _]) => event != null)
      .filter(([_, categories]) => categories && categories.length > 0)
      .takeUntil(this._destroy$)
      .subscribe(([event, categories]) => {
        const eventCat = categories.find((c) => c.id === event.category_id);
        this.selectedCategory$.next(eventCat || categories[0]);
      });
  }

  addEvent(): void {
    this.event$
      .take(1)
      .subscribe((event) => {
        if (!event.category_id || !event.title) {
          return;
        }

        this._store.dispatch(eventSave(event));
      });
  }

  updateEventField(field: string, value: any): void {
    this.event$
      .take(1)
      .subscribe((event) => {
        const eventToEmit = {...event, [field]: value};
        debugger
        this._store.dispatch(eventOpenModal(eventToEmit))
      });
  }

  selectCategory(category: ICategory): void {
    this.updateEventField('category_id', category.id);
    this.selectedCategory$.next(category);
    this.titleInput.nativeElement.focus();
  }

  categoryBgColor(category: ICategory): string {
    const selectedCategory = this.selectedCategory$.value;

    if (!category && selectedCategory) {
      return `#ffffff`;
    }

    if (category && selectedCategory && selectedCategory.id === category.id) {
      return `#${category.color}`;
    }

    return '#ffffff';
  }

  categoryColor(category: ICategory): string {
    const selectedCategory = this.selectedCategory$.value;

    if (!category && selectedCategory) {
      return `#${selectedCategory.color}`;
    }

    if (selectedCategory && selectedCategory.id === category.id) {
      return '#ffffff';
    }

    return `#${category.color}`;
  }

  categoryBorderColor(category: ICategory): string {
    const selectedCategory = this.selectedCategory$.value;

    if (!category) {
      return `#${selectedCategory.color}`;
    }

    return `#${category.color}`;
  }

  hideModal(): void {
    this._store.dispatch(eventCloseModal());
  }
}
