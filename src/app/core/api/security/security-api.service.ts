import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserCredentialsModel } from '@app/core/api';
import { ApiService } from '@app/core/api/api.service';
import { AuthenticationRequestBody } from './authentication-request-body.model';
import { AuthenticationResponseBody } from './authentication-response-body.model';
import { AuthorizationResponseBody } from '@app/core/api/security/authorization-response-body.model';

@Injectable({
  providedIn: 'root',
})
export class SecurityApiService {
  readonly namespace = 'security';
  private apiService = inject(ApiService);

  authenticate(userCredentials: UserCredentialsModel): Observable<string> {
    const authenticationRequestBody: AuthenticationRequestBody = {
      ...userCredentials,
    };
    return this.apiService
      .post<AuthenticationResponseBody>(this.namespace, 'authenticate', authenticationRequestBody)
      .pipe(map((result) => result.jwt));
  }

  authorize(): Observable<string> {
    return this.apiService
      .post<AuthorizationResponseBody>(this.namespace, 'authorize', {})
      .pipe(map((result) => result.jwt));
  }
}
