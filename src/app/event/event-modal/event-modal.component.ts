import { animate, trigger, transition, style } from '@angular/animations';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IEvent } from '../event.model';
import { cloneDeep } from 'lodash';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/app.state';
import { eventCreate, eventOpenModal, eventCloseModal } from '../store/event.actions';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { ICategory } from '../../category/category.model';
import { ISubcategory } from '../../subcategory/subcategory.model';
import { selectCategories, selectCategory } from '../../category/store/category.selectors';
import { selectSubcategories, selectSubcategoriesByCategory } from '../../subcategory/store/subcategory.selectors';
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
export class EventModalComponent extends ReactiveComponent implements OnInit, OnDestroy {
  event$: Observable<IEvent>;
  categories$: Observable<ICategory[]>;
  subcategories$: Observable<ISubcategory[]>;
  selectedCategory$: BehaviorSubject<ICategory> = new BehaviorSubject<ICategory>(null);
  selectedSubcategory$: BehaviorSubject<ISubcategory> = new BehaviorSubject<ISubcategory>(null);

  private _event: IEvent;

  constructor(private _store: Store<IAppState>) {
    super();
  }

  ngOnInit(): void {
    this.event$ =
      this._store
        .select(selectModalEvent)
        .map((event) => cloneDeep(event));

    this.selectedSubcategory$
      .withLatestFrom(this.event$)
      .subscribe(([subCat, event]) => {
        if (subCat) {
          this.updateEventField('subcategory_id', subCat.id);
        }
      });

    this.categories$ =
      this._store
        .select(selectCategories)
        .takeUntil(this._destroy$);

    this.categories$
      .withLatestFrom(this.event$)
      .filter(([categories, event]) => event != null && categories && categories.length > 0)
      .subscribe(([categories, event]) => {
        const cat = categories.find((c) => event && c.id === event.category_id) || categories[0];
        this.selectedCategory$.next(cat);
      });

    this.subcategories$ =
      this.selectedCategory$
        .filter((category) => category != null)
        .switchMap((category) => this._store.select(selectSubcategoriesByCategory(category.id)))
        .switchMap((subCatIDs) => this._store.select(selectSubcategories(subCatIDs)));

    this.subcategories$
    .withLatestFrom(this.event$)
      .filter(([subcategories, _]) => subcategories && subcategories.length > 0)
      .subscribe(([subcategories, event]) => {
        const subCat = subcategories.find((c) => event && c.id === event.subcategory_id) || subcategories[0];
        this.selectedSubcategory$.next(subCat);
      });
  }

  addEvent(): void {
    this.event$
      .take(1)
      .subscribe((event) => {
        if (!event.subcategory_id || !event.title) {
          return;
        }

        this._store.dispatch(eventCreate(event));
      });
  }

  updateEventField(field: string, value: any): void {
    this.event$
      .take(1)
      .subscribe((event) => this._store.dispatch(eventOpenModal({...event, [field]: value})));
  }

  selectCategory(category: ICategory): void {
    this.selectedCategory$.next(category);
  }

  selectSubcategory(subcategory: ISubcategory): void {
    this.selectedSubcategory$.next(subcategory);
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

  subcategoryBgColor(subcategory: ISubcategory): string {
    const selectedCategory = this.selectedCategory$.value;
    const selectedSubcategory = this.selectedSubcategory$.value;

    if (selectedSubcategory.id === subcategory.id) {
      return `#${selectedCategory.color}`;
    }

    return '#ffffff';
  }

  subcategoryColor(subcategory: ISubcategory): string {
    const selectedCategory = this.selectedCategory$.value;
    const selectedSubcategory = this.selectedSubcategory$.value;

    if (selectedSubcategory.id === subcategory.id) {
      return '#ffffff';
    }

    return `#${selectedCategory.color}`;
  }

  subcategoryBorderColor(subcategory: ISubcategory): string {
    const selectedCategory = this.selectedCategory$.value;
    const selectedSubcategory = this.selectedSubcategory$.value;

    return `#${selectedCategory.color}`;
  }

  hideModal(): void {
    this._store.dispatch(eventCloseModal());
  }
}
