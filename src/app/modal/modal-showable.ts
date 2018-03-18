import { Observable } from 'rxjs/Rx';

export interface IModalShowable {
  readonly closed?: Observable<void>;
  readonly opened?: Observable<void>;
}