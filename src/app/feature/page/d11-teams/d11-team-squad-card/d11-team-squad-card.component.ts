import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { D11TeamSeasonStat, PlayerSeasonStat } from '@app/core/api';
import { D11TeamApiService } from '@app/core/api/d11-team/d11-team-api.service';
import { Position } from '@app/core/api/model/position.model';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { TeamImgComponent } from '@app/shared/img/team-img/team-img.component';
import { FeePipe } from '@app/shared/pipes/fee.pipe';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-d11-team-squad-card',
  imports: [Card, D11TeamImgComponent, TeamImgComponent, FeePipe],
  templateUrl: './d11-team-squad-card.component.html',
})
export class D11TeamSquadCardComponent {
  d11TeamSeasonStat = input.required<D11TeamSeasonStat>();
  positions = input.required<Position[]>();

  protected rxPlayerSeasonStats = rxResource<PlayerSeasonStat[], number>({
    params: () => this.d11TeamSeasonStat().d11Team.id,
    stream: ({ params: d11TeamId }) =>
      this.d11TeamApiService.getPlayerSeasonStatsByD11TeamIdAndSeasonId(
        d11TeamId,
        this.d11TeamSeasonStat().season.id,
      ),
  });

  protected playerSeasonStats = computed(() =>
    [...(this.rxPlayerSeasonStats.value() ?? [])].sort(
      (a, b) =>
        a.position.sortOrder - b.position.sortOrder ||
        a.player.name.localeCompare(b.player.name) ||
        a.id - b.id,
    ),
  );

  protected positionSummary = computed(() =>
    [...this.positions()]
      .filter((pos) => pos.maxCount > 0)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((pos) => {
        const count = this.playerSeasonStats().filter((s) => s.position.id === pos.id).length;
        return { position: pos, count, hasError: count !== pos.maxCount };
      }),
  );

  protected totalFee = computed(() => this.playerSeasonStats().reduce((sum, s) => sum + s.fee, 0));

  private d11TeamApiService = inject(D11TeamApiService);
  private loadingService = inject(LoadingService);
  private dynamicDialogService = inject(DynamicDialogService);
  private routerService = inject(RouterService);

  constructor() {
    this.loadingService.register(inject(DestroyRef), this.rxPlayerSeasonStats.isLoading);
  }

  protected openDialog(stat: PlayerSeasonStat): void {
    this.dynamicDialogService.openPlayerSeasonStat(stat, this.playerSeasonStats(), {
      label: 'Player profile',
      icon: 'player',
      onClick: (current) =>
        this.routerService.navigateToPlayer((current as PlayerSeasonStat).player.id),
    });
  }
}
