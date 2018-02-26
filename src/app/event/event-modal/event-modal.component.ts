import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IEvent } from '../event.model';
import { cloneDeep } from 'lodash';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/app.state';
import { eventCreate } from '../store/event.actions';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { ICategory } from '../../category/category.model';
import { ISubcategory } from '../../subcategory/subcategory.model';
import { selectCategories, selectCategory } from '../../category/store/category.selectors';
import { selectSubcategories, selectSubcategoriesByCategory } from '../../subcategory/store/subcategory.selectors';

@Component({
  selector: 'tt-event-modal',
  styleUrls: ['./event-modal.component.scss'],
  templateUrl: './event-modal.component.html'
})
export class EventModalComponent implements OnInit, OnDestroy {
  @Input()
  set event(newEvent: IEvent) {
    this._event = cloneDeep(newEvent);
  }
  get event(): IEvent {
    return this._event;
  }

  categories$: Observable<ICategory[]>;
  subcategories$: Observable<ISubcategory[]>;
  selectedCategory$: BehaviorSubject<ICategory> = new BehaviorSubject<ICategory>(null);
  selectedSubcategory$: BehaviorSubject<ISubcategory> = new BehaviorSubject<ISubcategory>(null);

  private _event: IEvent;
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _store: Store<IAppState>) {}

  ngOnInit(): void {
    this.selectedSubcategory$
      .subscribe((subCat) => {
        if (subCat) {
          this.event.subcategory_id = subCat.id;
        }
      });

    this.categories$ =
      this._store
        .select(selectCategories)
        .takeUntil(this._destroy$);

    this.categories$
      .filter((categories) => categories && categories.length > 0)
      .first()
      .subscribe((categories) => {
        const cat = categories.find((c) => this.event && c.id === this.event.category_id) || categories[0];
        this.selectedCategory$.next(cat);
      });

    this.subcategories$ =
      this.selectedCategory$
        .filter((category) => category != null)
        .switchMap((category) => this._store.select(selectSubcategoriesByCategory(category.id)))
        .switchMap((subCatIDs) => this._store.select(selectSubcategories(subCatIDs)));

    this.subcategories$
      .filter((subcategories) => subcategories && subcategories.length > 0)
      .subscribe((subcategories) => {
        const subCat = subcategories.find((c) => this.event && c.id === this.event.subcategory_id) || subcategories[0];
        this.selectedSubcategory$.next(subCat);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  addEvent(): void {
    if (!this.event.subcategory_id || !this.event.title) {
      return;
    }

    this._store.dispatch(eventCreate(this.event));
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
}
