import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiVersion = environment.apiVersion;

  post<T>(
    namespace: string,
    endpoint: string,
    body: unknown,
    options?: {
      headers?: HttpHeaders;
      params?: HttpParams;
    },
  ): Observable<T> {
    const url = `/${this.apiVersion}/${namespace}/${endpoint}`;
    return this.http.post<T>(url, body, options);
  }

  get<T>(
    namespace: string,
    endpoint: string,
    options?: {
      headers?: HttpHeaders;
      params?: HttpParams;
    },
  ): Observable<T> {
    const url = `/${this.apiVersion}/${namespace}/${endpoint}`;
    return this.http.get<T>(url, options);
  }
}
