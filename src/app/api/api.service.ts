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
      .post(this._buildUrl(path), body, this._buildOptions(params));
  }

  patch(path: string, body: any = {}, params: any = {}): Observable<any> {
    return this._http
      .patch(this._buildUrl(path), body, this._buildOptions(params));
  }

  delete(path: string, params: any = {}): Observable<any> {
    return this._http
      .delete(this._buildUrl(path), this._buildOptions(params));
  }

  private _buildUrl(path: string): string {
    return `${environment.apiUrl}${path}`;
  }

  private _buildOptions(params: any = {}): any {
    let newParams = new HttpParams();
    Object.keys(params).forEach((k) => {
      newParams = newParams.set(k, params[k].toString());
    });

    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      httpOptions.headers = httpOptions.headers.set('Authorization', authToken);
    }

    return Object.assign({}, {params: newParams}, httpOptions);
  }
}
