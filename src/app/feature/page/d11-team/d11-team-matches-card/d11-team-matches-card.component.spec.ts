import { fakeD11MatchBase, fakeD11TeamBase, fakeSeason } from '@app/test';
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

  it('renders home and away d11 team names for each match', async () => {
    const homeD11Team = { ...fakeD11TeamBase(), name: 'Team1' };
    const awayD11Team = { ...fakeD11TeamBase(), name: 'Team2' };
    const d11Match = { ...fakeD11MatchBase(), homeD11Team, awayD11Team };

    await render(D11TeamMatchesCardComponent, {
      inputs: { d11Matches: [d11Match], season: undefined },
      providers,
    });

    expect(screen.getByText('Team1')).toBeInTheDocument();
    expect(screen.getByText('Team2')).toBeInTheDocument();
  });

  it('renders all matches', async () => {
    const d11Matches = [fakeD11MatchBase(), fakeD11MatchBase(), fakeD11MatchBase()];

    await render(D11TeamMatchesCardComponent, {
      inputs: { d11Matches, season: undefined },
      providers,
    });

    expect(document.querySelectorAll('app-d11-match-result-col')).toHaveLength(3);
  });

  it('renders empty message when no matches', async () => {
    await render(D11TeamMatchesCardComponent, {
      inputs: { d11Matches: [], season: undefined },
      providers,
    });

    expect(screen.getByText('No matches found')).toBeInTheDocument();
  });

  it('renders match date for each match', async () => {
    const d11Match = { ...fakeD11MatchBase(), datetime: '2025-06-15T14:30:00.000Z' };

    await render(D11TeamMatchesCardComponent, {
      inputs: { d11Matches: [d11Match], season: undefined },
      providers,
    });

    expect(screen.getByText('Jun 15')).toBeInTheDocument();
  });

  it('adds separator to non-last matches', async () => {
    const d11Matches = [fakeD11MatchBase(), fakeD11MatchBase()];

    await render(D11TeamMatchesCardComponent, {
      inputs: { d11Matches, season: undefined },
      providers,
    });

    const cols = document.querySelectorAll('app-d11-match-result-col');
    expect(cols[0].classList).toContain('app-grid-separator');
    expect(cols[1].classList).not.toContain('app-grid-separator');
  });
});
