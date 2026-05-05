import { fakeMatchBase, fakeSeason, fakeTeamBase } from '@app/test';
import { Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { TeamMatchesCardComponent } from './team-matches-card.component';

const mockRouterService = { navigateToMatch: vi.fn() };
const providers = [{ provide: RouterService, useValue: mockRouterService }];

describe('TeamMatchesCardComponent', () => {
  it('renders header with season name', async () => {
    const season = fakeSeason();

    await render(TeamMatchesCardComponent, {
      inputs: { matches: [], season },
      providers,
    });

    expect(screen.getByText(`Matches ${season.name}`)).toBeInTheDocument();
  });

  it('renders "Matches" header when no season', async () => {
    await render(TeamMatchesCardComponent, {
      inputs: { matches: [], season: undefined },
      providers,
    });

    expect(screen.getByText('Matches')).toBeInTheDocument();
  });

  it('renders home and away team names for each match', async () => {
    const homeTeam = { ...fakeTeamBase(), name: 'Team1' };
    const awayTeam = { ...fakeTeamBase(), name: 'Team2' };
    const match = { ...fakeMatchBase(), homeTeam, awayTeam };

    await render(TeamMatchesCardComponent, {
      inputs: { matches: [match], season: undefined },
      providers,
    });

    expect(screen.getByText('Team1')).toBeInTheDocument();
    expect(screen.getByText('Team2')).toBeInTheDocument();
  });

  it('renders date for each match', async () => {
    const match = {
      ...fakeMatchBase(),
      status: Status.PENDING,
      datetime: '2025-06-15T14:30:00.000Z',
    };

    await render(TeamMatchesCardComponent, {
      inputs: { matches: [match], season: undefined },
      providers,
    });

    expect(screen.getByText('Jun 15')).toBeInTheDocument();
  });

  it('renders all matches', async () => {
    const matches = [fakeMatchBase(), fakeMatchBase(), fakeMatchBase()];

    await render(TeamMatchesCardComponent, {
      inputs: { matches, season: undefined },
      providers,
    });

    expect(document.querySelectorAll('app-match-result-col')).toHaveLength(3);
  });

  it('renders empty message when no matches', async () => {
    await render(TeamMatchesCardComponent, {
      inputs: { matches: [], season: undefined },
      providers,
    });

    expect(screen.getByText('No matches found')).toBeInTheDocument();
  });
});
