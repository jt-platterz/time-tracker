import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiService {
  constructor(private _http: HttpClient) {}

  get(path: string, params: any = {}): Observable<any> {
    return this._http
      .get(this._buildUrl(path), this._buildOptions(params));
  }

  post(path: string, body: any = {}, params: any = {}): Observable<any> {
    return this._http
      .post(this._buildUrl(path), body, this._buildOptions());
  }

  private _buildUrl(path: string): string {
    return `${environment.apiUrl}${path}`;
  }

  private _buildOptions(params: any = {}): any {
    let newParams = new HttpParams();
    Object.keys(params).forEach((k) => {
      newParams = newParams.set(k, params[k].toString());
    });

    return Object.assign({}, {params: newParams}, httpOptions);
  }
}
