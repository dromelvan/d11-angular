import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { UserSessionService } from './user-session.service';

@Injectable({
  providedIn: 'root',
})
export class UserActionService {
  readonly drawerVisible = signal(false);

  private userSession = inject(UserSessionService);
  private logoutTrigger = signal(0);
  private logoutResource = rxResource<boolean, number>({
    params: () => this.logoutTrigger(),
    stream: ({ params }) => (params > 0 ? this.userSession.unauthorize() : of(false)),
  });

  open(): void {
    this.drawerVisible.set(true);
  }

  close(): void {
    this.drawerVisible.set(false);
  }

  onLogout(): void {
    this.close();
    this.logoutTrigger.update((count) => count + 1);
  }
}
