import { Component, inject } from '@angular/core';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { IconUserCircleComponent } from '@app/shared/icon/user-circle/icon-user-circle.component';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-user-session',
  imports: [AvatarComponent, IconUserCircleComponent, Menu],
  templateUrl: './user-session.component.html',
})
export class UserSessionComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Sign out',
      icon: 'pi pi-sign-out',
      command: () => this.onLogout(),
    },
  ];
  protected userSession = inject(UserSessionService);

  public onLogout() {
    this.userSession.unauthorize().subscribe({
      error: () => {},
    });
  }
}
