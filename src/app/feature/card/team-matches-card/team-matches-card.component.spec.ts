import { RouterService } from '@app/core/router/router.service';
import { fakeSeason } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect, vi } from 'vitest';
import { TeamMatchesCardComponent } from './team-matches-card.component';

const providers = [{ provide: RouterService, useValue: { navigateToMatch: vi.fn() } }];

describe('TeamMatchesCardComponent', () => {
  it('renders header with season name', async () => {
    const season = fakeSeason();

    await render(TeamMatchesCardComponent, { inputs: { matches: [], season }, providers });

    expect(screen.getByText(`Matches ${season.name}`)).toBeInTheDocument();
  });

  it('renders Matches header when no season', async () => {
    await render(TeamMatchesCardComponent, {
      inputs: { matches: [], season: undefined },
      providers,
    });

    expect(screen.getByText('Matches')).toBeInTheDocument();
  });
});
