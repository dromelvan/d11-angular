import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { RouterService } from '@app/core/router/router.service';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { IconComponent } from '@app/shared/icon/icon.component';
import { Drawer } from 'primeng/drawer';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-session',
  imports: [AvatarComponent, Drawer, IconComponent],
  templateUrl: './user-session.component.html',
})
export class UserSessionComponent {
  protected userSession = inject(UserSessionService);
  protected drawerVisible = signal(false);

  private routerService = inject(RouterService);
  private logoutTrigger = signal(0);
  private logoutResource = rxResource<boolean, number>({
    params: () => this.logoutTrigger(),
    stream: ({ params }) => (params > 0 ? this.userSession.unauthorize() : of(false)),
  });

  public onLogout(): void {
    this.close();
    this.logoutTrigger.update((count) => count + 1);
  }

  protected open(): void {
    this.drawerVisible.set(true);
  }

  protected close(): void {
    this.drawerVisible.set(false);
  }

  protected onLogin(): void {
    this.routerService.navigateToLogin();
  }
}
