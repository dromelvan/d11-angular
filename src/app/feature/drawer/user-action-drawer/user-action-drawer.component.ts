import { Component, computed, inject } from '@angular/core';
import { UserActionService } from '@app/core/auth/user-action.service';
import { Status } from '@app/core/api/model/status.model';
import { CurrentService } from '@app/core/current/current.service';
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

  protected canCreateTransferWindow = computed(
    () =>
      this.currentService.season()?.status === Status.ACTIVE &&
      this.currentService.transferWindow()?.status === Status.FINISHED,
  );

  private currentService = inject(CurrentService);
  private routerService = inject(RouterService);

  protected onCreatePlayer(): void {
    this.userActionService.close();
    this.routerService.navigateToCreatePlayer();
  }

  protected onCreateTransferWindow(): void {
    this.userActionService.close();
    this.routerService.navigateToCreateTransferWindow();
  }
}
