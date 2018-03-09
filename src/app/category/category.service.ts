import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs/Rx';
import { ICategory } from './category.model';

@Injectable()
export class CategoryService {
  constructor (private _api: ApiService) {}

  list(): Observable<ICategory[]> {
    return this._api
      .get('categories')
      .map((response) => response.categories);
  }
}
