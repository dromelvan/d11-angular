import { Component } from '@angular/core';
import { D11TeamSeasonStat, PlayerSeasonStat, Position } from '@app/core/api';
import { D11TeamApiService } from '@app/core/api/d11-team/d11-team-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import {
  fakeD11TeamBase,
  fakeD11TeamSeasonStat,
  fakePlayerBase,
  fakePlayerSeasonStat,
  fakePosition,
  fakeSeason,
  fakeTeamBase,
} from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { D11TeamSquadCardComponent } from './d11-team-squad-card.component';

let d11TeamSeasonStat: D11TeamSeasonStat;
let positions: Position[];
let playerSeasonStats: PlayerSeasonStat[];
let d11TeamApi: D11TeamApiService;
let loadingService: LoadingService;
let dynamicDialogService: DynamicDialogService;
let routerService: RouterService;

const season = fakeSeason();
const d11Team = fakeD11TeamBase();

@Component({
  template: ` <app-d11-team-squad-card
    [d11TeamSeasonStat]="d11TeamSeasonStat"
    [positions]="positions"
  />`,
  standalone: true,
  imports: [D11TeamSquadCardComponent],
})
class HostComponent {
  d11TeamSeasonStat = d11TeamSeasonStat;
  positions = positions;
}

describe('D11TeamSquadCardComponent', () => {
  describe('with data', () => {
    beforeEach(async () => {
      const positionGK: Position = {
        ...fakePosition(),
        id: 1,
        name: 'Goalkeeper',
        code: 'GK',
        maxCount: 1,
        sortOrder: 1,
      };
      const positionMF: Position = {
        ...fakePosition(),
        id: 2,
        name: 'Midfielder',
        code: 'MF',
        maxCount: 3,
        sortOrder: 2,
      };
      const positionNA: Position = {
        ...fakePosition(),
        id: 3,
        name: 'Unknown',
        code: 'N/A',
        maxCount: 0,
        sortOrder: 3,
      };

      positions = [positionGK, positionMF, positionNA];

      const team = { ...fakeTeamBase(), dummy: false };

      playerSeasonStats = [
        {
          ...fakePlayerSeasonStat(),
          player: { ...fakePlayerBase(), name: 'Player1' },
          team,
          position: positionGK,
          fee: 50,
        },
        {
          ...fakePlayerSeasonStat(),
          player: { ...fakePlayerBase(), name: 'Player2' },
          team,
          position: positionMF,
          fee: 30,
        },
        {
          ...fakePlayerSeasonStat(),
          player: { ...fakePlayerBase(), name: 'Player3' },
          team,
          position: positionMF,
          fee: 20,
        },
      ];

      d11TeamSeasonStat = {
        ...fakeD11TeamSeasonStat(),
        d11Team: { ...d11Team, name: 'D11Team1' },
        season,
      };

      d11TeamApi = {
        getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of(playerSeasonStats)),
      } as unknown as D11TeamApiService;

      loadingService = { register: vi.fn() } as unknown as LoadingService;
      dynamicDialogService = { openPlayerSeasonStat: vi.fn() } as unknown as DynamicDialogService;
      routerService = { navigateToPlayer: vi.fn() } as unknown as RouterService;

      await render(HostComponent, {
        providers: [
          { provide: D11TeamApiService, useValue: d11TeamApi },
          { provide: LoadingService, useValue: loadingService },
          { provide: DynamicDialogService, useValue: dynamicDialogService },
          { provide: RouterService, useValue: routerService },
        ],
      });
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(document.querySelector('app-d11-team-squad-card')).toBeInTheDocument();
      });
    });

    it('renders d11 team name in card header', async () => {
      await waitFor(() => {
        expect(screen.getByText('D11Team1')).toBeInTheDocument();
      });
    });

    it('fetches player season stats by d11TeamId and seasonId', async () => {
      await waitFor(() => {
        expect(
          d11TeamApi.getPlayerSeasonStatsByD11TeamIdAndSeasonId,
        ).toHaveBeenCalledExactlyOnceWith(d11TeamSeasonStat.d11Team.id, season.id);
      });
    });

    it('renders player names', async () => {
      await waitFor(() => {
        expect(screen.getByText('Player1')).toBeInTheDocument();
        expect(screen.getByText('Player2')).toBeInTheDocument();
        expect(screen.getByText('Player3')).toBeInTheDocument();
      });
    });

    it('renders position summary counts', async () => {
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('applies text-error class to mismatched position count', async () => {
      await waitFor(() => {
        const spans = Array.from(document.querySelectorAll('.text-error'));
        expect(spans.some((el) => el.textContent?.trim() === '2')).toBe(true);
      });
    });

    it('does not apply text-error to matched position count', async () => {
      await waitFor(() => {
        const errorSpans = Array.from(document.querySelectorAll('.text-error'));
        expect(errorSpans.some((el) => el.textContent?.trim() === '1')).toBe(false);
      });
    });

    it('renders total fee', async () => {
      await waitFor(() => {
        expect(screen.getByText('Total 10.0m')).toBeInTheDocument();
      });
    });

    it('does not render position with maxCount 0 in summary', async () => {
      await waitFor(() => {
        const separators = Array.from(
          document.querySelectorAll('.app-text-lowest-emphasis'),
        ).filter((el) => el.textContent?.trim() === '-');
        expect(separators.length).toBe(1);
      });
    });

    it('opens dialog with player season stat on row click', async () => {
      await waitFor(() => {
        expect(document.querySelectorAll('.cursor-pointer').length).toBe(playerSeasonStats.length);
      });

      const rows = document.querySelectorAll<HTMLElement>('.cursor-pointer');
      rows[0].click();

      expect(dynamicDialogService.openPlayerSeasonStat).toHaveBeenCalledWith(
        playerSeasonStats[0],
        expect.arrayContaining([playerSeasonStats[0]]),
        expect.objectContaining({ label: 'Player profile', icon: 'player' }),
      );
    });
  });

  describe('without data', () => {
    beforeEach(async () => {
      positions = [fakePosition()];

      d11TeamSeasonStat = {
        ...fakeD11TeamSeasonStat(),
        d11Team: { ...d11Team, name: 'D11Team2' },
        season,
      };

      d11TeamApi = {
        getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])),
      } as unknown as D11TeamApiService;

      loadingService = { register: vi.fn() } as unknown as LoadingService;
      dynamicDialogService = { openPlayerSeasonStat: vi.fn() } as unknown as DynamicDialogService;
      routerService = { navigateToPlayer: vi.fn() } as unknown as RouterService;

      await render(
        `<app-d11-team-squad-card [d11TeamSeasonStat]="d11TeamSeasonStat" [positions]="positions" />`,
        {
          imports: [D11TeamSquadCardComponent],
          componentProperties: { d11TeamSeasonStat, positions },
          providers: [
            { provide: D11TeamApiService, useValue: d11TeamApi },
            { provide: LoadingService, useValue: loadingService },
            { provide: DynamicDialogService, useValue: dynamicDialogService },
            { provide: RouterService, useValue: routerService },
          ],
        },
      );
    });

    it('renders d11 team name', async () => {
      await waitFor(() => {
        expect(screen.getByText('D11Team2')).toBeInTheDocument();
      });
    });

    it('does not render summary row when no players', async () => {
      await waitFor(() => {
        expect(document.querySelector('app-d11-team-squad-card')).toBeInTheDocument();
      });
      expect(document.querySelectorAll('.text-error').length).toBe(0);
    });
  });
});
