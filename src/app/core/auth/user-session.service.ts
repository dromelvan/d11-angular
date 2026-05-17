import { computed, inject, Injectable, signal } from '@angular/core';
import { D11TeamBase, SecurityApiService, User, UserCredentialsModel } from '@app/core/api';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  public readonly jwt = signal<string | undefined>(undefined);
  public readonly expiresAt = signal<string | undefined>(undefined);
  public readonly user = signal<User | undefined>(undefined);
  public readonly d11Team = signal<D11TeamBase | undefined>(undefined);
  public readonly loggedIn = computed(() => this.jwt() !== undefined);

  private securityApi = inject(SecurityApiService);

  authenticate(userCredentials: UserCredentialsModel): Observable<string> {
    return this.securityApi.authenticate(userCredentials).pipe(
      tap((response) => {
        this.jwt.set(response.jwt);
        this.expiresAt.set(response.expiresAt);
        this.user.set(response.user);
        this.d11Team.set(response.d11Team);
      }),
      map((response) => response.jwt),
    );
  }

  authorize(): Observable<string> {
    return this.securityApi.authorize().pipe(
      tap((response) => {
        this.jwt.set(response.jwt);
        this.expiresAt.set(response.expiresAt);
        this.user.set(response.user);
        this.d11Team.set(response.d11Team);
      }),
      map((response) => response.jwt),
    );
  }

  unauthorize(): Observable<boolean> {
    return this.securityApi.unauthorize().pipe(
      tap((loggedOut) => {
        if (loggedOut) {
          this.jwt.set(undefined);
          this.expiresAt.set(undefined);
          this.user.set(undefined);
          this.d11Team.set(undefined);
        }
      }),
    );
  }

  isJwtExpired(): boolean {
    const expiresAt = this.expiresAt();
    if (expiresAt == null) return false;
    return Date.now() >= new Date(expiresAt).getTime() - 10_000;
  }
}
