import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs/Observable';
import { AuthAction, IAuthLoginAction, AuthActions, authLoginSuccess, authLoginFailure, IAuthLoginInitializeAction, authInitializeComplete, IAuthLoginSuccessAction, IAuthLoginFailureAction } from './auth.actions';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/app.state';
import { selectAuthToken } from './auth.selectors';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private _actions: Actions,
    private _store: Store<IAppState>,
    private _router: Router,
    private _authService: AuthService
  ) {}

  @Effect()
  loginEffect(): Observable<AuthAction> {
    return this._actions
      .ofType<IAuthLoginAction>(AuthActions.Login)
      .switchMap((action) => {
        return this._authService
          .login(action.email, action.password)
          .map((authentication) => authLoginSuccess(authentication.user, authentication.authToken))
          .catch(() => [authLoginFailure('Unable to log you in')]);
      });
  }

  @Effect()
  initializeEffect(): Observable<AuthAction> {
    return this._actions
      .ofType<IAuthLoginInitializeAction>(AuthActions.Initialize)
      .withLatestFrom(this._store.select(selectAuthToken))
      .switchMap(([action, token]) => {
        return this._authService.me()
          .map((user) => authInitializeComplete(user, token))
          .catch(() => [authInitializeComplete(null, null)]);
      });
  }

  @Effect({dispatch: false})
  logoutSuccessEffect(): Observable<void> {
    return this._actions
      .ofType<IAuthLoginFailureAction>(AuthActions.LoginFailure)
      .map(() => {
        this._router.navigate(['/auth']);
      });
  }

  @Effect({dispatch: false})
  loginSuccessEffect(): Observable<void> {
    return this._actions
      .ofType<IAuthLoginSuccessAction>(AuthActions.LoginSuccess)
      .map(() => {
        this._router.navigate(['/today']);
      });
  }
}
