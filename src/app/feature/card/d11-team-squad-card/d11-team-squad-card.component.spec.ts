import { D11TeamApiService } from '@app/core/api/d11-team/d11-team-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakeD11TeamBase, fakeD11TeamSeasonStat, fakePosition, fakeSeason } from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { D11TeamSquadCardComponent } from './d11-team-squad-card.component';

const providers = [
  {
    provide: D11TeamApiService,
    useValue: { getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn().mockReturnValue(of([])) },
  },
  { provide: LoadingService, useValue: { register: vi.fn() } },
  { provide: DynamicDialogService, useValue: { openPlayerSeasonStat: vi.fn() } },
  { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
];

describe('D11TeamSquadCardComponent', () => {
  it('renders d11 team name in card header', async () => {
    const d11Team = { ...fakeD11TeamBase(), name: 'D11Team1' };
    const d11TeamSeasonStat = { ...fakeD11TeamSeasonStat(), d11Team, season: fakeSeason() };

    await render(D11TeamSquadCardComponent, {
      inputs: { d11TeamSeasonStat, positions: [fakePosition()] },
      providers,
    });

    await waitFor(() => {
      expect(screen.getByText('D11Team1')).toBeInTheDocument();
    });
  });
});
