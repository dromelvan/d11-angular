import { Component } from '@angular/core';
import { MatchBase, Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatch, fakeMatchBase } from '@app/test';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { DatePipe } from '@angular/common';
import { vi } from 'vitest';
import { MatchWeekMatchesCardComponent } from './match-week-matches-card.component';

const mockRouterService = { navigateToMatch: vi.fn() };
const providers = [{ provide: RouterService, useValue: mockRouterService }];

let matches: MatchBase[];

@Component({
  template: ` <app-match-week-matches-card [matches]="matches" />`,
  standalone: true,
  imports: [MatchWeekMatchesCardComponent],
})
class HostComponent {
  matches = matches;
}

describe('MatchWeekMatchesCardComponent', () => {
  beforeEach(() => vi.clearAllMocks());

  // Renders ---------------------------------------------------------------------------------------

  describe('renders', () => {
    beforeEach(async () => {
      matches = [fakeMatch(), fakeMatch()];
      await render(HostComponent, { providers });
    });

    it('match week matches card', () => {
      expect(document.querySelector('app-match-week-matches-card')).toBeInTheDocument();
    });

    it('Premier League header', () => {
      expect(screen.getByText('Premier League')).toBeInTheDocument();
    });

    it('home team code for each match', () => {
      for (const match of matches) {
        expect(screen.getByText(match.homeTeam.code)).toBeInTheDocument();
      }
    });

    it('away team code for each match', () => {
      for (const match of matches) {
        expect(screen.getByText(match.awayTeam.code)).toBeInTheDocument();
      }
    });
  });

  // Kickoff time ----------------------------------------------------------------------------------

  describe('renders kickoff time', () => {
    beforeEach(async () => {
      matches = [{ ...fakeMatchBase(), status: Status.PENDING }];
      await render(HostComponent, { providers });
    });

    it('in HH:mm format', () => {
      const formatted = new DatePipe('en-US').transform(matches[0].datetime, 'HH:mm');
      expect(screen.getByText(formatted!)).toBeInTheDocument();
    });
  });

  // Elapsed time ----------------------------------------------------------------------------------

  describe('renders elapsed time', () => {
    it('for active match', async () => {
      matches = [{ ...fakeMatchBase(), status: Status.ACTIVE, elapsed: '45' }];
      await render(HostComponent, { providers });

      expect(screen.getByText(matches[0].elapsed)).toBeInTheDocument();
    });

    it('for full time match', async () => {
      matches = [{ ...fakeMatchBase(), status: Status.FULL_TIME, elapsed: 'FT' }];
      await render(HostComponent, { providers });

      expect(screen.getByText(matches[0].elapsed)).toBeInTheDocument();
    });

    it('for finished match', async () => {
      matches = [{ ...fakeMatchBase(), status: Status.FINISHED, elapsed: 'FT' }];
      await render(HostComponent, { providers });

      expect(screen.getByText(matches[0].elapsed)).toBeInTheDocument();
    });

    it('does not render elapsed for pending match', async () => {
      matches = [{ ...fakeMatchBase(), status: Status.PENDING, elapsed: 'N/A' }];
      await render(HostComponent, { providers });

      expect(screen.queryByText(matches[0].elapsed)).not.toBeInTheDocument();
    });
  });

  // Date grouping ---------------------------------------------------------------------------------

  describe('date grouping', () => {
    const date1 = '2025-03-15';
    const date2 = '2025-03-16';
    const datePipe = new DatePipe('en-US');

    it('renders date headers', async () => {
      matches = [
        { ...fakeMatchBase(), status: Status.FINISHED, datetime: `${date1}T15:00:00.000Z` },
        { ...fakeMatchBase(), status: Status.FINISHED, datetime: `${date2}T15:00:00.000Z` },
      ];
      await render(HostComponent, { providers });

      const formatted1 = datePipe.transform(date1, 'EEEE, MMMM d');
      const formatted2 = datePipe.transform(date2, 'EEEE, MMMM d');

      const headers = Array.from(
        document.querySelectorAll('.app-grid-header, .app-grid-sub-header'),
      ).map((el) => el.textContent?.trim());

      expect(headers).toContain(formatted1!);
      expect(headers).toContain(formatted2!);
      expect(headers.indexOf(formatted1!)).toBeLessThan(headers.indexOf(formatted2!));
    });

    it('sorts matches by datetime within a group', async () => {
      const early = {
        ...fakeMatchBase(),
        status: Status.FINISHED,
        datetime: `${date1}T12:00:00.000Z`,
      };
      const late = {
        ...fakeMatchBase(),
        status: Status.FINISHED,
        datetime: `${date1}T17:00:00.000Z`,
      };
      matches = [late, early];
      await render(HostComponent, { providers });

      const rows = document.querySelectorAll('.col-span-3.grid');

      expect(rows[0].textContent).toContain(early.homeTeam.code);
      expect(rows[1].textContent).toContain(late.homeTeam.code);
    });
  });

  // postponed -------------------------------------------------------------------------------------

  describe('postponed matches', () => {
    beforeEach(async () => {
      matches = [
        { ...fakeMatchBase(), status: Status.FINISHED, datetime: '2025-03-15T15:00:00.000Z' },
        { ...fakeMatchBase(), status: Status.POSTPONED, datetime: '2025-03-15T15:00:00.000Z' },
      ];
      await render(HostComponent, { providers });
    });

    it('renders postponed group header', () => {
      expect(screen.getByText('Postponed')).toBeInTheDocument();
    });

    it('renders postponed match in postponed group', () => {
      const groups = document.querySelectorAll('.app-grid-header, .app-grid-sub-header');
      const texts = Array.from(groups).map((g) => g.textContent?.trim());
      expect(texts).toContain('Postponed');
      expect(texts.filter((t) => t === 'Postponed')).toHaveLength(1);
    });

    it('sorts postponed last', () => {
      const headers = document.querySelectorAll('.app-grid-header, .app-grid-sub-header');
      const lastHeader = headers[headers.length - 1];
      expect(lastHeader.textContent?.trim()).toBe('Postponed');
    });
  });

  // navigation ------------------------------------------------------------------------------------

  describe('navigation', () => {
    beforeEach(async () => {
      matches = [fakeMatch()];
      await render(HostComponent, { providers });
    });

    it('navigates to match on row click', async () => {
      await userEvent.click(
        screen.getByText(matches[0].homeTeam.code).closest('[class*=col-span]')!,
      );

      expect(mockRouterService.navigateToMatch).toHaveBeenCalledExactlyOnceWith(matches[0].id);
    });
  });
});
