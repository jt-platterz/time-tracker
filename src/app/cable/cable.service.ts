import { Injectable } from '@angular/core';
import { Ng2Cable } from 'ng2-cable';
import { Channels } from './channel.enum';
import { environment } from '../../environments/environment';

@Injectable()
export class CableService {
  constructor(private _ng2Cable: Ng2Cable) {}

  subscribeToChannel(channelName: Channels, params: any = {}): void {
    const url = `${environment.apiUrl}cable?jwt=${localStorage.getItem('authToken')}`;

    this._ng2Cable.subscribe(url, channelName, params);
  }

  unsubscribe(): void {
    this._ng2Cable.unsubscribe();
  }
}
