import { Component, inject } from '@angular/core';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { IconComponent } from '@app/shared/icon/icon.component';

@Component({
  selector: 'app-user-session',
  imports: [AvatarComponent, Menu, IconComponent],
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
