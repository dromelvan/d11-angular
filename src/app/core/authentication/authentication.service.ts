import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { CredentialsModel } from './credentials.model';
import { UserSessionModel } from './user-session.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private httpClient = inject(HttpClient);

  login(credentials: CredentialsModel): Observable<UserSessionModel> {
    const userSession: UserSessionModel = {
      username: credentials.username,
      token: 'dummy',
      persistent: credentials.persistent,
    };
    return of(userSession).pipe(delay(1500));
  }
}
