import { Component, computed, inject } from '@angular/core';
import { UserActionService } from '@app/core/auth/user-action.service';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { RouterService } from '@app/core/router/router.service';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import { UserActionDrawerComponent } from '@app/feature/component/user-action-drawer/user-action-drawer.component';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-user-session',
  imports: [AvatarComponent, UserActionDrawerComponent, SvgIconComponent],
  templateUrl: './user-session.component.html',
})
export class UserSessionComponent {
  protected userSession = inject(UserSessionService);
  protected userActionService = inject(UserActionService);
  protected d11TeamId = computed(() => this.userSession.d11Team()?.id ?? 1);

  private routerService = inject(RouterService);

  protected onLogin(): void {
    this.routerService.navigateToLogin();
  }
}
