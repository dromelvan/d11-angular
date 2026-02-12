import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface ApiGetRequest {
  namespace: string;
  id?: number;
  endpoint?: string;
  options?: {
    headers?: HttpHeaders;
    params?: HttpParams;
  };
}
