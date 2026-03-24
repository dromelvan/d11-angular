import { Component } from '@angular/core';
import { Match, MatchWeek } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { fakeMatch, fakeMatchWeek } from '@app/test';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { render, screen, waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { MatchWeekPageComponent } from './match-week-page.component';

let matchWeek: MatchWeek;
let matches: Match[];
let matchWeekApi: MatchWeekApiService;
let matchApi: MatchApiService;
let loadingService: LoadingService;
let routerService: RouterService;

@Component({
  template: ` <app-match-week [matchWeekId]="matchWeekId" />`,
  standalone: true,
  imports: [MatchWeekPageComponent],
})
class HostComponent {
  matchWeekId: number | undefined = matchWeek.id;
}

@Component({
  template: ` <app-match-week />`,
  standalone: true,
  imports: [MatchWeekPageComponent],
})
class NoIdHostComponent {}

function makeProviders() {
  return [
    { provide: MatchWeekApiService, useValue: matchWeekApi },
    { provide: MatchApiService, useValue: matchApi },
    { provide: LoadingService, useValue: loadingService },
    { provide: RouterService, useValue: routerService },
  ];
}

describe('MatchWeekPageComponent', () => {
  beforeEach(() => {
    matchWeek = fakeMatchWeek();
    matches = [fakeMatch(), fakeMatch()];

    matchWeekApi = {
      getById: vi.fn().mockReturnValue(of(matchWeek)),
      getCurrentMatchWeek: vi.fn().mockReturnValue(of(matchWeek)),
    } as unknown as MatchWeekApiService;

    matchApi = {
      getMatchesByMatchWeekId: vi.fn().mockReturnValue(of(matches)),
    } as unknown as MatchApiService;

    loadingService = { register: vi.fn() } as unknown as LoadingService;
    routerService = {
      navigateToMatchWeek: vi.fn(),
      navigateToMatch: vi.fn(),
    } as unknown as RouterService;
  });

  describe('with matchWeekId', () => {
    beforeEach(async () => {
      await render(HostComponent, { providers: makeProviders() });
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-match-week-page')).toBeInTheDocument();
      });
    });

    it('renders match week number', async () => {
      await waitFor(() => {
        expect(
          screen.getByText(`Week ${matchWeek.matchWeekNumber}`, { exact: false }),
        ).toBeInTheDocument();
      });
    });

    it('renders season name', async () => {
      await waitFor(() => {
        expect(screen.getByText(matchWeek.season.name, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders matches card', async () => {
      await waitFor(() => {
        expect(screen.getByText('Premier League')).toBeInTheDocument();

        for (const match of matches) {
          expect(screen.getByText(match.homeTeam.code)).toBeInTheDocument();
          expect(screen.getByText(match.awayTeam.code)).toBeInTheDocument();
        }
      });
    });

    it('calls getById with matchWeekId', () => {
      expect(matchWeekApi.getById).toHaveBeenCalledWith(matchWeek.id);
      expect(matchWeekApi.getCurrentMatchWeek).not.toHaveBeenCalled();
    });
  });

  describe('without matchWeekId', () => {
    beforeEach(async () => {
      await render(NoIdHostComponent, { providers: makeProviders() });
    });

    it('calls getCurrentMatchWeek', () => {
      expect(matchWeekApi.getCurrentMatchWeek).toHaveBeenCalled();
      expect(matchWeekApi.getById).not.toHaveBeenCalled();
    });

    it('renders match week number', async () => {
      await waitFor(() => {
        expect(
          screen.getByText(`Week ${matchWeek.matchWeekNumber}`, { exact: false }),
        ).toBeInTheDocument();
      });
    });

    it('renders matches card', async () => {
      await waitFor(() => {
        expect(screen.getByText('Premier League')).toBeInTheDocument();
      });
    });
  });
});
