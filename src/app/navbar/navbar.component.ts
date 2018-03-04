import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../store/app.state';
import { IUser } from '../auth/user';
import { Observable } from 'rxjs/Rx';
import { ReactiveComponent } from '../reactive-component/reactive.component';
import { selectCurrentUser } from '../auth/store/auth.selectors';

@Component({
  selector: 'tt-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent extends ReactiveComponent implements OnInit {
  user$: Observable<IUser>;

  constructor(
    private _store: Store<IAppState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.user$ =
      this._store
        .select(selectCurrentUser)
        .takeUntil(this._destroy$);
  }
}
