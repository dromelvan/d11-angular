import { Component } from '@angular/core';
import type { MatchBase, TeamBase } from '@app/core/api';
import { fakeMatchBase, fakeTeamBase } from '@app/core/api/test/faker-util';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { MatchBaseComponent } from './match-base.component';

const renderMatchBase = (match: MatchBase, team?: TeamBase) => {
  @Component({
    template: ` <app-match-base [match]="match" [team]="team" />`,
    standalone: true,
    imports: [MatchBaseComponent],
  })
  class HostComponent {
    match = match;
    team = team;
  }

  return render(HostComponent, {});
};

describe('MatchBaseComponent', () => {
  let match: MatchBase;

  beforeEach(async () => {
    match = fakeMatchBase();
    await renderMatchBase(match);
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
      screen.getByText(`${match.homeTeamGoalsScored}\u2013${match.awayTeamGoalsScored}`, {
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
    team = fakeTeamBase();
    match = { ...fakeMatchBase(), homeTeam: { ...fakeTeamBase(), id: team.id } };
    await renderMatchBase(match, team);
  });

  it('renders home team code bold', () => {
    const element = screen.getAllByText(match.homeTeam.code)[0].closest('span')?.parentElement;
    expect(element).toHaveClass('font-bold');
  });

  it('does not render away team code bold', () => {
    const element = screen.getAllByText(match.awayTeam.code)[0].closest('span')?.parentElement;
    expect(element).not.toHaveClass('font-bold');
  });
});

describe('MatchBaseComponent when team is the away team', () => {
  let match: MatchBase;
  let team: TeamBase;

  beforeEach(async () => {
    team = fakeTeamBase();
    match = { ...fakeMatchBase(), awayTeam: { ...fakeTeamBase(), id: team.id } };
    await renderMatchBase(match, team);
  });

  it('renders away team code bold', () => {
    const element = screen.getAllByText(match.awayTeam.code)[0].closest('span')?.parentElement;
    expect(element).toHaveClass('font-bold');
  });

  it('does not render home team code bold', () => {
    const element = screen.getAllByText(match.homeTeam.code)[0].closest('span')?.parentElement;
    expect(element).not.toHaveClass('font-bold');
  });
});
