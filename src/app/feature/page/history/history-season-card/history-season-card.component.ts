import { Component, computed, inject, input } from '@angular/core';
import { SeasonWinners, Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { D11TeamImgComponent } from '@app/shared/img/d11-team-img/d11-team-img.component';
import { PlayerImgComponent } from '@app/shared/img/player-img/player-img.component';
import { TeamImgComponent } from '@app/shared/img/team-img/team-img.component';
import { OrdinalPipe } from '@app/shared/pipes/ordinal.pipe';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-history-season-card',
  imports: [
    Card,
    D11TeamImgComponent,
    TeamImgComponent,
    PlayerImgComponent,
    RatingPipe,
    OrdinalPipe,
  ],
  templateUrl: './history-season-card.component.html',
})
export class HistorySeasonCardComponent {
  seasonWinners = input.required<SeasonWinners>();

  protected readonly isFinished = computed(
    () => this.seasonWinners().season.status === Status.FINISHED,
  );
  protected readonly winnerLabel = computed(() =>
    this.seasonWinners().season.status === Status.ACTIVE ? 'leader' : 'winner',
  );

  private readonly routerService = inject(RouterService);

  protected navigateToD11Team(): void {
    const { seasonWinners } = this;
    this.routerService.navigateToD11Team(
      seasonWinners().d11TeamSeasonStat.d11Team.id,
      seasonWinners().season.id,
    );
  }

  protected navigateToPlayer(): void {
    const { seasonWinners } = this;
    this.routerService.navigateToPlayer(
      seasonWinners().playerSeasonStat.player.id,
      seasonWinners().season.id,
    );
  }

  protected navigateToTeam(): void {
    const { seasonWinners } = this;
    this.routerService.navigateToTeam(
      seasonWinners().teamSeasonStat.team.id,
      seasonWinners().season.id,
    );
  }
}
