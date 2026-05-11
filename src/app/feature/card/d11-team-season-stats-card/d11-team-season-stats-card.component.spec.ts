import { RouterService } from '@app/core/router/router.service';
import { fakeD11TeamSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect, vi } from 'vitest';
import { D11TeamSeasonStatsCardComponent } from './d11-team-season-stats-card.component';

const mockRouterService = { navigateToD11Team: vi.fn() };
const providers = [{ provide: RouterService, useValue: mockRouterService }];

describe('D11TeamSeasonStatsCardComponent', () => {
  it('renders "D11" card header', async () => {
    await render(D11TeamSeasonStatsCardComponent, {
      inputs: { d11TeamSeasonStats: [fakeD11TeamSeasonStat()] },
      providers,
    });

    expect(screen.getByText('D11')).toBeInTheDocument();
  });
});
