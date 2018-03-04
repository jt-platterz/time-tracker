import { OnDestroy } from '@angular/core';
import * as uuid from 'uuid/v4';
import { Subject } from 'rxjs/Rx';

export class ReactiveComponent implements OnDestroy {
  protected _destroy$: Subject<void> = new Subject<void>();
  protected _uuid: string = uuid();

  private _subjectMap: Map<string, Subject<any>> = new Map();

  ngOnDestroy(): void {
    Array.from(this._subjectMap.keys()).forEach((key) => {
      this._subjectMap.get(key).complete();
      this._subjectMap.delete(key);
    });

    this._destroy$.next();
    this._destroy$.complete();
  }

  protected _registerSubject(subject: Subject<any>): Subject<any> {
    const subUUID = uuid();
    this._subjectMap.set(subUUID, subject);

    return subject;
  }
}
