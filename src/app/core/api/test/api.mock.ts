import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type PostFn = <T>(
  endpoint: string,
  body: unknown,
  options?: {
    headers?: HttpHeaders;
    params?: HttpParams;
  },
) => Observable<T>;
