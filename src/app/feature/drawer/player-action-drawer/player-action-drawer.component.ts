import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PlayerApiService, PlayerTransferContext } from '@app/core/api';
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
  protected rxPlayerTransferContext = rxResource<PlayerTransferContext, number | undefined>({
    params: () => this.playerActionService.player()?.id,
    stream: ({ params }) => this.playerApiService.getPlayerTransferContextByPlayerId(params!),
  });

  private playerApiService = inject(PlayerApiService);
  private routerService = inject(RouterService);

  protected onEditPlayer(): void {
    const playerId = this.playerActionService.player()!.id;
    this.playerActionService.close();
    this.routerService.navigateToEditPlayer(playerId);
  }

  protected onAddToShortlist(): void {
    this.playerActionService.close();
  }

  protected onAddToTransferList(): void {
    this.playerActionService.close();
  }

  protected onRemoveFromTransferList(): void {
    this.playerActionService.close();
  }

  protected onMakeTransferBid(): void {
    this.playerActionService.close();
  }

  protected onRemoveTransferBid(): void {
    this.playerActionService.close();
  }
}
