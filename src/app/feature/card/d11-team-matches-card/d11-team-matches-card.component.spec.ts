import { fakeSeason } from '@app/test';
import { RouterService } from '@app/core/router/router.service';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { D11TeamMatchesCardComponent } from './d11-team-matches-card.component';

const mockRouterService = { navigateToD11Match: vi.fn() };
const providers = [{ provide: RouterService, useValue: mockRouterService }];

describe('D11TeamMatchesCardComponent', () => {
  it('renders header with season name', async () => {
    const season = fakeSeason();

    await render(D11TeamMatchesCardComponent, {
      inputs: { d11Matches: [], season },
      providers,
    });

    expect(screen.getByText(`Matches ${season.name}`)).toBeInTheDocument();
  });

  it('renders "Matches" header when no season', async () => {
    await render(D11TeamMatchesCardComponent, {
      inputs: { d11Matches: [], season: undefined },
      providers,
    });

    expect(screen.getByText('Matches')).toBeInTheDocument();
  });
});
