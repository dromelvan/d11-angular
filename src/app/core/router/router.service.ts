import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private readonly router = inject(Router);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly section = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return (route.data['section'] as string) ?? null;
      }),
    ),
  );

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
