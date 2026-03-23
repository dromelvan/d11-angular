import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  private readonly router = inject(Router);
  private readonly stack = signal<string[]>([]);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly hasStack = computed(() => this.stack().length > 0);

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

  public navigateToPlayer(playerId: number, seasonId?: number, push = true): Promise<boolean> {
    const extras = seasonId ? { queryParams: { seasonId: seasonId } } : {};
    this.updateStack('players', push);
    return this.router.navigate(['players', playerId], extras);
  }

  public navigateToMatchWeek(matchWeekId: number, push = true): Promise<boolean> {
    this.updateStack('match-weeks', push);
    return this.router.navigate(['match-weeks', matchWeekId]);
  }

  public navigateToMatch(matchId: number, push = true): Promise<boolean> {
    this.updateStack('matches', push);
    return this.router.navigate(['matches', matchId]);
  }

  public navigateToCurrentMatchWeek(): Promise<boolean> {
    this.stack.set([]);
    return this.router.navigate(['match-weeks']);
  }

  public navigateToTable(): Promise<boolean> {
    this.stack.set([]);
    return this.router.navigate(['tables']);
  }

  public navigateToPrevious(): Promise<boolean> {
    const stack = this.stack();
    if (stack.length === 0) {
      return Promise.resolve(false);
    }
    const previous = stack[stack.length - 1];
    this.stack.update((s) => s.slice(0, -1));
    return this.router.navigateByUrl(previous);
  }

  public clearStack(): void {
    this.stack.set([]);
  }

  private updateStack(routePrefix: string, push: boolean): void {
    if (!push) {
      this.stack.set([]);
      return;
    }
    if (!this.router.url.startsWith(`/${routePrefix}`)) {
      this.stack.update((s) => [...s, this.router.url]);
    }
  }
}
