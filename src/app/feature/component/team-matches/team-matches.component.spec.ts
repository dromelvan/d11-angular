import { Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatchBase, fakeSeason, fakeTeamBase } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect, vi } from 'vitest';
import { TeamMatchesComponent } from './team-matches.component';

const providers = [{ provide: RouterService, useValue: { navigateToMatch: vi.fn() } }];

describe('TeamMatchesComponent', () => {
  it('renders Matches heading without season', async () => {
    await render(TeamMatchesComponent, { inputs: { matches: [] }, providers });

    expect(screen.getByRole('heading', { name: 'Matches', level: 2 })).toBeInTheDocument();
  });

  it('renders heading with season name when season is provided', async () => {
    const season = fakeSeason();
    await render(TeamMatchesComponent, { inputs: { matches: [], season }, providers });

    expect(
      screen.getByRole('heading', { name: `Matches ${season.name}`, level: 2 }),
    ).toBeInTheDocument();
  });

  it('renders home and away team names for each match', async () => {
    const homeTeam = { ...fakeTeamBase(), name: 'Team1' };
    const awayTeam = { ...fakeTeamBase(), name: 'Team2' };
    const match = { ...fakeMatchBase(), homeTeam, awayTeam };

    await render(TeamMatchesComponent, { inputs: { matches: [match] }, providers });

    expect(screen.getByText('Team1')).toBeInTheDocument();
    expect(screen.getByText('Team2')).toBeInTheDocument();
  });

  it('renders date for each match', async () => {
    const match = {
      ...fakeMatchBase(),
      status: Status.PENDING,
      datetime: '2025-06-15T14:30:00.000Z',
    };

    await render(TeamMatchesComponent, { inputs: { matches: [match] }, providers });

    expect(screen.getByText('Jun 15')).toBeInTheDocument();
  });

  it('renders all matches', async () => {
    const matches = [fakeMatchBase(), fakeMatchBase(), fakeMatchBase()];

    await render(TeamMatchesComponent, { inputs: { matches }, providers });

    expect(document.querySelectorAll('app-match-result-col')).toHaveLength(3);
  });

  it('renders empty message when no matches', async () => {
    await render(TeamMatchesComponent, { inputs: { matches: [] }, providers });

    expect(screen.getByText('No matches found')).toBeInTheDocument();
  });
});
