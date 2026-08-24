import { TestBed } from '@angular/core/testing';
import type { MatchBase, TeamBase } from '@app/core/api';
import { Status } from '@app/core/api';
import { fakeMatchBase, fakeTeamBase } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { describe, expect, it, beforeEach } from 'vitest';
import { MatchBaseComponent } from './match-base.component';

async function setup(match: MatchBase, team?: TeamBase) {
  await render(MatchBaseComponent, { inputs: { match, team } });
  TestBed.tick();
}

describe('MatchBaseComponent', () => {
  let match: MatchBase;

  beforeEach(async () => {
    match = {
      ...fakeMatchBase(),
      status: Status.FINISHED,
      homeTeam: { ...fakeTeamBase(), code: 'HOM', name: 'Home Team' },
      awayTeam: { ...fakeTeamBase(), code: 'AWY', name: 'Away Team' },
    };
    await setup(match);
  });

  it('renders', () => {
    expect(document.querySelector('.app-match-base')).toBeInTheDocument();
  });

  it('renders home team code', () => {
    const element = screen.getByText(match.homeTeam.code);
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('sm:hidden');
  });

  it('renders home team name', () => {
    const element = screen.getByText(match.homeTeam.name);
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('sm:block');
  });

  it('renders away team code', () => {
    const element = screen.getByText(match.awayTeam.code);
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('sm:hidden');
  });

  it('renders away team name', () => {
    const element = screen.getByText(match.awayTeam.name);
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('sm:block');
  });

  it('renders score', () => {
    expect(
      screen.getByText(`${match.homeTeamGoalsScored}–${match.awayTeamGoalsScored}`, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it('renders home team image', () => {
    expect(screen.getByAltText(match.homeTeam.name)).toBeInTheDocument();
  });

  it('renders away team image', () => {
    expect(screen.getByAltText(match.awayTeam.name)).toBeInTheDocument();
  });
});

describe('MatchBaseComponent when team is the home team', () => {
  let match: MatchBase;
  let team: TeamBase;

  beforeEach(async () => {
    team = { ...fakeTeamBase(), id: 1 };
    match = {
      ...fakeMatchBase(),
      homeTeam: { ...fakeTeamBase(), id: 1, code: 'HOM', name: 'Home Team' },
      awayTeam: { ...fakeTeamBase(), id: 2, code: 'AWY', name: 'Away Team' },
    };
    await setup(match, team);
  });

  it('renders home team code bold', () => {
    const element = screen.getByText(match.homeTeam.code).closest('span')?.parentElement;
    expect(element).toHaveClass('font-bold');
  });

  it('does not render away team code bold', () => {
    const element = screen.getByText(match.awayTeam.code).closest('span')?.parentElement;
    expect(element).not.toHaveClass('font-bold');
  });
});

describe('MatchBaseComponent when team is the away team', () => {
  let match: MatchBase;
  let team: TeamBase;

  beforeEach(async () => {
    team = { ...fakeTeamBase(), id: 2 };
    match = {
      ...fakeMatchBase(),
      homeTeam: { ...fakeTeamBase(), id: 1, code: 'HOM', name: 'Home Team' },
      awayTeam: { ...fakeTeamBase(), id: 2, code: 'AWY', name: 'Away Team' },
    };
    await setup(match, team);
  });

  it('renders away team code bold', () => {
    const element = screen.getByText(match.awayTeam.code).closest('span')?.parentElement;
    expect(element).toHaveClass('font-bold');
  });

  it('does not render home team code bold', () => {
    const element = screen.getByText(match.homeTeam.code).closest('span')?.parentElement;
    expect(element).not.toHaveClass('font-bold');
  });
});

describe('MatchBaseComponent PENDING', () => {
  it('renders vs', async () => {
    const match = { ...fakeMatchBase(), status: Status.PENDING };
    await setup(match);

    expect(screen.getByText('vs')).toBeInTheDocument();
  });
});

describe('MatchBaseComponent POSTPONED', () => {
  it('renders PP', async () => {
    const match = { ...fakeMatchBase(), status: Status.POSTPONED };
    await setup(match);

    expect(screen.getByText('PP')).toBeInTheDocument();
  });
});
