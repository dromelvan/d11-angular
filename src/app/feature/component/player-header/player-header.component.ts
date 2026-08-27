import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import type { Player, PlayerSeasonStat, PlayerTransferContext } from '@app/core/api';
import { PlayerApiService } from '@app/core/api';
import { PlayerActionService } from '@app/core/auth/player-action.service';
import { UserActionService } from '@app/core/auth/user-action.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { PlayerActionDrawerComponent } from '@app/feature/drawer/player-action-drawer/player-action-drawer.component';
import { ImgWidth, PlayerImgComponent } from '@app/shared/img';
import { D11TeamBaseComponent, TeamBaseComponent } from '@app/shared/resource';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';

@Component({
  selector: 'app-player-header',
  imports: [
    PlayerImgComponent,
    TeamBaseComponent,
    D11TeamBaseComponent,
    IconButtonComponent,
    PlayerActionDrawerComponent,
  ],
  templateUrl: './player-header.component.html',
})
export class PlayerHeaderComponent {
  player = input.required<Player>();
  playerSeasonStat = input.required<PlayerSeasonStat | undefined>();

  protected rxPlayerTransferContext = rxResource<PlayerTransferContext, number>({
    params: () => this.player().id,
    stream: ({ params }) => this.playerApiService.getPlayerTransferContextByPlayerId(params),
  });

  protected isLoading = computed(() => this.rxPlayerTransferContext.isLoading());

  protected showPlayerAction = computed(
    () =>
      this.userActionService.isAdministrator() ||
      this.rxPlayerTransferContext.value()?.playerId != null,
  );

  protected readonly ImgWidth = ImgWidth;

  private playerApiService = inject(PlayerApiService);
  private playerActionService = inject(PlayerActionService);
  private userActionService = inject(UserActionService);
  private loadingService = inject(LoadingService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.isLoading);
  }

  protected onOpenDrawer(): void {
    this.playerActionService.open(this.player(), this.rxPlayerTransferContext.value());
  }
}
