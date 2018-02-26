import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IAuthentication } from './login';
import { ApiService } from '../api/api.service';
import { IUser } from './user';

@Injectable()
export class AuthService {
  constructor(private _api: ApiService) {}

  login(email: string, password): Observable<IAuthentication> {
    return this._api
      .post('auth', {email, password})
      .map((response) => response.authentication);
  }

  me(): Observable<IUser> {
    return this._api
      .get('auth/me')
      .map((response) => response.current_user);
  }
}
