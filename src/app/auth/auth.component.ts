import { Component, OnInit, OnDestroy } from '@angular/core';
import { ILogin } from './login';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { authLogin } from './store/auth.actions';
import { Observable, Subject } from 'rxjs/Rx';
import { selectLoginError } from './store/auth.selectors';

@Component({
  selector: 'tt-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  loginObj: ILogin = {email: '', password: ''};
  error$: Observable<string>;

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _store: Store<IAppState>) {}

  login(): void {
    this._store.dispatch(authLogin(this.loginObj.email, this.loginObj.password));
  }

  ngOnInit(): void {
    this.error$ =
      this._store
        .select(selectLoginError)
        .takeUntil(this._destroy$);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
