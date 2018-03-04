import { Component, OnInit, OnDestroy } from '@angular/core';
import { ILogin } from './login';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { authLogin } from './store/auth.actions';
import { Observable, Subject } from 'rxjs/Rx';
import { selectLoginError } from './store/auth.selectors';
import { ReactiveComponent } from '../reactive-component/reactive.component';

@Component({
  selector: 'tt-auth',
  styleUrls: ['./auth.component.scss'],
  templateUrl: './auth.component.html'
})
export class AuthComponent extends ReactiveComponent implements OnInit, OnDestroy {
  loginObj: ILogin = {email: '', password: ''};
  error$: Observable<string>;

  constructor(private _store: Store<IAppState>) {
    super();
  }

  login(): void {
    this._store.dispatch(authLogin(this.loginObj.email, this.loginObj.password));
  }

  ngOnInit(): void {
    this.error$ =
      this._store
        .select(selectLoginError)
        .takeUntil(this._destroy$);
  }
}
