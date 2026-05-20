import { Component, inject } from '@angular/core';
import { PlayerActionService } from '@app/core/auth/player-action.service';
import { RouterService } from '@app/core/router/router.service';
import { IconComponent } from '@app/shared/icon/icon.component';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-player-action-drawer',
  imports: [Drawer, IconComponent],
  templateUrl: './player-action-drawer.component.html',
})
export class PlayerActionDrawerComponent {
  protected playerActionService = inject(PlayerActionService);

  private routerService = inject(RouterService);

  protected onEditPlayer(): void {
    this.playerActionService.close();
    this.routerService.navigateToEditPlayer(this.playerActionService.player()!.id);
  }
}
