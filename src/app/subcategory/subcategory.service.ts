import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs/Rx';
import { ISubcategory } from './subcategory.model';

@Injectable()
export class SubcategoryService {
  constructor (private _api: ApiService) {}

  list(): Observable<ISubcategory[]> {
    return this._api
      .get('subcategories')
      .map((response) => response.subcategories);
  }
}
