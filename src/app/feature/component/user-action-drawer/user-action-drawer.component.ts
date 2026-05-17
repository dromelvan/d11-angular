import { Component, inject } from '@angular/core';
import { UserActionService } from '@app/core/auth/user-action.service';
import { RouterService } from '@app/core/router/router.service';
import { IconComponent } from '@app/shared/icon/icon.component';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-user-action-drawer',
  imports: [Drawer, IconComponent],
  templateUrl: './user-action-drawer.component.html',
})
export class UserActionDrawerComponent {
  protected userActionService = inject(UserActionService);

  private routerService = inject(RouterService);

  protected onCreatePlayer(): void {
    this.userActionService.close();
    this.routerService.navigateToCreatePlayer();
  }
}
