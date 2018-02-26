import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { Observable } from 'rxjs/Rx';
import { selectAuthInitialized, selectCurrentUser } from './store/auth.selectors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _store: Store<IAppState>,
    private _router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._store
      .select(selectAuthInitialized)
      .filter((init) => init)
      .switchMap(() => this._store.select(selectCurrentUser))
      .map((currentUser) => currentUser != null)
      .map((authenticated) => {
        if (!authenticated) {
          this._router.navigate(['/auth']);

          return false;
        }

        return true;
      })
      .take(1);
  }
}
