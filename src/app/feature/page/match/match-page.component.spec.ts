import { Component } from '@angular/core';
import { MatchContext, PlayerMatchStat, Status } from '@app/core/api';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { fakeMatch, fakePlayerMatchStat, fakeStadium, fakeTeamBase } from '@app/test';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { render, screen, waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { MatchPageComponent } from './match-page.component';

let matchContext: MatchContext;
let playerMatchStats: PlayerMatchStat[];

let matchApi: MatchApiService;
let loadingService: LoadingService;

@Component({
  template: ` <app-match-page [matchId]="matchId" />`,
  standalone: true,
  imports: [MatchPageComponent],
})
class HostComponent {
  matchId = 1;
}

const mockDynamicDialogService = { openPlayerMatchStat: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

describe('MatchPageComponent', () => {
  describe('pending', () => {
    beforeEach(async () => {
      const homeTeam = fakeTeamBase();
      const awayTeam = fakeTeamBase();
      const match = { ...fakeMatch(), homeTeam, awayTeam, status: Status.PENDING };
      matchContext = { match, stadium: fakeStadium() };

      matchApi = {
        getById: vi.fn().mockReturnValue(of(matchContext)),
        getPlayerMatchStatsByMatchId: vi.fn().mockReturnValue(of([])),
      } as unknown as MatchApiService;

      loadingService = { register: vi.fn() } as unknown as LoadingService;

      await render(HostComponent, {
        providers: [
          { provide: MatchApiService, useValue: matchApi },
          { provide: LoadingService, useValue: loadingService },
          { provide: DynamicDialogService, useValue: mockDynamicDialogService },
          { provide: RouterService, useValue: mockRouterService },
        ],
      });
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-match-page')).toBeInTheDocument();
      });
    });

    it('renders match header', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-match-header-card')).toBeInTheDocument();
      });
    });

    it('does not render player stats', async () => {
      await waitFor(() => {
        expect(screen.queryByText('Player stats')).not.toBeInTheDocument();
      });
    });
  });

  describe('not pending', () => {
    beforeEach(async () => {
      const homeTeam = fakeTeamBase();
      const awayTeam = fakeTeamBase();
      const match = { ...fakeMatch(), homeTeam, awayTeam, status: Status.FINISHED };
      matchContext = { match, stadium: fakeStadium() };

      const playerMatchStat = fakePlayerMatchStat();
      playerMatchStat.match = { ...playerMatchStat.match, homeTeam, awayTeam };
      playerMatchStat.team = homeTeam;
      playerMatchStats = [playerMatchStat];

      matchApi = {
        getById: vi.fn().mockReturnValue(of(matchContext)),
        getPlayerMatchStatsByMatchId: vi.fn().mockReturnValue(of(playerMatchStats)),
      } as unknown as MatchApiService;

      loadingService = {
        register: vi.fn(),
      } as unknown as LoadingService;

      await render(HostComponent, {
        providers: [
          { provide: MatchApiService, useValue: matchApi },
          { provide: LoadingService, useValue: loadingService },
          { provide: DynamicDialogService, useValue: mockDynamicDialogService },
          { provide: RouterService, useValue: mockRouterService },
        ],
      });
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-match-page')).toBeInTheDocument();
      });
    });

    it('renders match header', async () => {
      await waitFor(() => {
        expect(document.querySelector('.app-match-header-card')).toBeInTheDocument();
      });
    });

    it('renders player stats', async () => {
      await waitFor(() => {
        expect(screen.getByText('Player stats')).toBeInTheDocument();
      });
    });
  });
});
