import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private router = inject(Router);

  public navigateToPlayer(playerId: number, seasonId?: number): Promise<boolean> {
    const extras = seasonId ? { queryParams: { seasonId: seasonId } } : {};
    return this.router.navigate(['players', playerId], extras);
  }

  public navigateToMatchWeek(matchWeekId: number): Promise<boolean> {
    return this.router.navigate(['match-weeks', matchWeekId]);
  }

  public navigateToMatch(matchId: number): Promise<boolean> {
    return this.router.navigate(['matches', matchId]);
  }
}
