import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiGetRequest } from './api-get-request.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiVersion = environment.apiVersion;

  post<T>(
    namespace: string,
    endpoint: string | undefined,
    body: unknown,
    options?: {
      headers?: HttpHeaders;
      params?: HttpParams;
    },
  ): Observable<T> {
    const url = '/' + [this.apiVersion, namespace, endpoint].filter(Boolean).join('/');
    return this.http.post<T>(url, body, options);
  }

  put<T>(namespace: string, id: number, body: unknown): Observable<T> {
    const url = `/${this.apiVersion}/${namespace}/${id}`;
    return this.http.put<T>(url, body);
  }

  patch<T>(namespace: string, id: number, body: unknown): Observable<T> {
    const url = `/${this.apiVersion}/${namespace}/${id}`;
    return this.http.patch<T>(url, body);
  }

  delete(namespace: string, id: number): Observable<void> {
    const url = `/${this.apiVersion}/${namespace}/${id}`;
    return this.http.delete<void>(url);
  }

  get<T>(apiGetRequest: ApiGetRequest): Observable<T> {
    const url =
      '/' +
      [this.apiVersion, apiGetRequest.namespace, apiGetRequest.id, apiGetRequest.endpoint]
        .filter(Boolean)
        .join('/');

    return this.http.get<T>(url, apiGetRequest.options);
  }
}
