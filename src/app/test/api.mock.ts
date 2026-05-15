import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiGetRequest } from '@app/core/api/api-get-request.model';

export type PostFn = <T>(
  endpoint: string,
  body: unknown,
  options?: {
    headers?: HttpHeaders;
    params?: HttpParams;
  },
) => Observable<T>;

export type PutFn = <T>(namespace: string, id: number, body: unknown) => Observable<T>;

export type PatchFn = <T>(namespace: string, id: number, body: unknown) => Observable<T>;

export type DeleteFn = (namespace: string, id: number) => Observable<void>;

export type GetFn = <T>(apiGetRequest: ApiGetRequest) => Observable<T>;
