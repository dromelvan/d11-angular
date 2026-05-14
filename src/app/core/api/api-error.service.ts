import { Injectable, signal } from '@angular/core';
import { ApiError } from './model/api-error.model';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorService {
  readonly error = signal<ApiError | null>(null);

  setError(error: ApiError): void {
    this.error.set(error);
  }
}
