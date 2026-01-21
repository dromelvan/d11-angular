import { computed, inject } from '@angular/core';
import { tap } from 'rxjs';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { SecurityApiService, UserCredentialsModel } from '@app/core/api';

interface ApplicationState {
  jwt: string | undefined;
}

const initialState: ApplicationState = {
  jwt: undefined,
};

export const UserSessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    jwt: computed(() => store.jwt()),
  })),
  withMethods((store, securityApi = inject(SecurityApiService)) => ({
    authenticate: (userCredentials: UserCredentialsModel) => {
      return securityApi.authenticate(userCredentials).pipe(
        tap((result) => {
          patchState(store, { jwt: result });
        }),
      );
    },
  })),
);
