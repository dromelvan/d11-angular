import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { render, screen } from '@testing-library/angular';
import { fakeMatchBase } from '@app/test';
import { MatchBase, Status } from '@app/core/api';
import { expect } from 'vitest';
import { MatchHeaderComponent } from './match-header.component';

let match: MatchBase | undefined;
let links: boolean;

@Component({
  template: ` <app-match-header [match]="match" [links]="links" />`,
  standalone: true,
  imports: [MatchHeaderComponent],
})
class HostComponent {
  match = match;
  links = links;
}

describe('MatchHeaderComponent', () => {
  describe('no match', () => {
    beforeEach(async () => {
      match = undefined;
      links = true;
      await render(HostComponent, {});
    });

    it('does not render', () => {
      expect(document.querySelector('app-match-header > *')).not.toBeInTheDocument();
    });
  });

  describe('with match', () => {
    beforeEach(async () => {
      match = { ...fakeMatchBase(), status: Status.FINISHED };
      links = true;
      await render(HostComponent, {});
    });

    it('renders home team short name', () => {
      expect(screen.getByText(match!.homeTeam.shortName)).toBeInTheDocument();
    });

    it('renders home team full name', () => {
      expect(screen.getByText(match!.homeTeam.name)).toBeInTheDocument();
    });

    it('renders away team short name', () => {
      expect(screen.getByText(match!.awayTeam.shortName)).toBeInTheDocument();
    });

    it('renders away team full name', () => {
      expect(screen.getByText(match!.awayTeam.name)).toBeInTheDocument();
    });

    it('renders score', () => {
      expect(
        screen.getByText(`${match!.homeTeamGoalsScored}\u2013${match!.awayTeamGoalsScored}`, {
          exact: false,
        }),
      ).toBeInTheDocument();
    });

    it('renders elapsed time', () => {
      expect(screen.getByText(match!.elapsed)).toBeInTheDocument();
    });

    it('renders stadium', () => {
      expect(
        screen.getByText(`${match!.stadium!.name}, ${match!.stadium!.city}`),
      ).toBeInTheDocument();
    });

    it('renders datetime', () => {
      const formatted = new DatePipe('en-US').transform(match!.datetime, 'MMM dd, yyyy, H:mm');
      expect(screen.getByText(formatted!)).toBeInTheDocument();
    });
  });

  describe('pending match', () => {
    beforeEach(async () => {
      match = { ...fakeMatchBase(), status: Status.PENDING };
      links = true;
      await render(HostComponent, {});
    });

    it('does not render score', () => {
      expect(
        screen.queryByText(`${match!.homeTeamGoalsScored}\u2013${match!.awayTeamGoalsScored}`, {
          exact: false,
        }),
      ).not.toBeInTheDocument();
    });
  });

  describe('with links', () => {
    beforeEach(async () => {
      match = { ...fakeMatchBase(), status: Status.FINISHED };
      links = true;
      await render(HostComponent, {});
    });

    it('renders links', () => {
      expect(
        screen.getByText(`Match week ${match!.matchWeek.matchWeekNumber}`, { exact: false }),
      ).toBeInTheDocument();
      expect(screen.getByText('League table')).toBeInTheDocument();
    });
  });

  describe('without links', () => {
    beforeEach(async () => {
      match = { ...fakeMatchBase(), status: Status.FINISHED };
      links = false;
      await render(HostComponent, {});
    });

    it('does not render links', () => {
      expect(
        screen.queryByText(`Match week ${match!.matchWeek.matchWeekNumber}`, { exact: false }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('League table')).not.toBeInTheDocument();
    });
  });
});
