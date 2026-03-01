import { Component, computed, input } from '@angular/core';
import { PlayerSeasonStat } from '@app/core/api';
import { Card } from 'primeng/card';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import { TeamBaseComponent } from '@app/shared/resource';

@Component({
  selector: 'app-player-career-card',
  imports: [Card, RatingPipe, TeamBaseComponent],
  templateUrl: './player-career-card.component.html',
})
export class PlayerCareerCardComponent {
  playerSeasonStats = input.required<PlayerSeasonStat[]>();

  protected summary = computed(() => {
    const stats = this.playerSeasonStats();
    const seasons = stats.length;
    const ratedStats = stats.filter((s) => s.rating > 0);
    const rating =
      ratedStats.length > 0
        ? ratedStats.reduce((sum, s) => sum + s.rating, 0) / ratedStats.length
        : 0;
    const points = stats.reduce((sum, s) => sum + s.points, 0);
    return { seasons, rating, points };
  });
}
