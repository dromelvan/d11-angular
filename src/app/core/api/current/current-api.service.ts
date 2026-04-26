import { inject, Injectable } from '@angular/core';
import { ApiService } from '@app/core/api/api.service';
import { Observable } from 'rxjs';
import { Current } from '@app/core/api';
import { CurrentResponseBody } from './current-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class CurrentApiService {
  readonly namespace = 'current';
  private apiService = inject(ApiService);

  getCurrent(): Observable<Current> {
    return this.apiService.get<CurrentResponseBody>({ namespace: this.namespace });
  }
}
