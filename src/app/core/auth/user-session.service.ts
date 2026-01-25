import { inject, Injectable, signal } from '@angular/core';
import { SecurityApiService, UserCredentialsModel } from '@app/core/api';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  public readonly jwt = signal<string | undefined>(undefined);

  private securityApi = inject(SecurityApiService);

  authenticate(userCredentials: UserCredentialsModel): Observable<string> {
    return this.securityApi.authenticate(userCredentials).pipe(
      tap((token) => {
        this.jwt.set(token);
      }),
    );
  }

  authorize(): Observable<string> {
    return this.securityApi.authorize().pipe(
      tap((token) => {
        this.jwt.set(token);
      }),
    );
  }

  unauthorize(): Observable<boolean> {
    return this.securityApi.unauthorize().pipe(
      tap((loggedOut) => {
        if (loggedOut) {
          this.jwt.set(undefined);
        }
      }),
    );
  }
}
