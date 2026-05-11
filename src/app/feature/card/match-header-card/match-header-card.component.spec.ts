import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { fakeGoal, fakeMatch, fakeTeamBase } from '@app/test';
import { Match, PlayerMatchStat } from '@app/core/api';
import { expect } from 'vitest';
import { MatchHeaderCardComponent } from './match-header-card.component';

let match: Match | undefined;
let playerMatchStats: PlayerMatchStat[] | undefined;

@Component({
  template: ` <app-match-header-card [match]="match" [playerMatchStats]="playerMatchStats" />`,
  standalone: true,
  imports: [MatchHeaderCardComponent],
})
class HostComponent {
  match = match;
  playerMatchStats = playerMatchStats;
}

describe('MatchHeaderCardComponent', () => {
  describe('without match', () => {
    beforeEach(async () => {
      match = undefined;
      playerMatchStats = undefined;
      await render(HostComponent, {});
    });

    it('does not render', () => {
      expect(document.querySelector('app-match-header-card > *')).not.toBeInTheDocument();
    });
  });

  describe('with match', () => {
    beforeEach(async () => {
      match = {
        ...fakeMatch(),
        homeTeam: { ...fakeTeamBase(), name: 'AAA' },
        awayTeam: { ...fakeTeamBase(), name: 'BBB' },
      };
      playerMatchStats = undefined;
      await render(HostComponent, {});
    });

    it('renders match header', () => {
      expect(screen.getByText(match!.homeTeam.name)).toBeInTheDocument();
      expect(screen.getByText(match!.awayTeam.name)).toBeInTheDocument();
    });

    it('does not render match events', () => {
      expect(screen.queryByTestId('match-event')).not.toBeInTheDocument();
    });
  });

  describe('with events', () => {
    beforeEach(async () => {
      match = {
        ...fakeMatch(),
        homeTeamGoals: [{ ...fakeGoal(), time: 30 }],
      };
      playerMatchStats = undefined;
      await render(HostComponent, {});
    });

    it('renders match header', () => {
      expect(screen.getByText(match!.homeTeam.name)).toBeInTheDocument();
      expect(screen.getByText(match!.awayTeam.name)).toBeInTheDocument();
    });

    it('does not render match events', () => {
      expect(screen.queryByTestId('match-event')).toBeInTheDocument();
    });
  });
});
