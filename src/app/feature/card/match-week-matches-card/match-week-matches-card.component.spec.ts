import { Component } from '@angular/core';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { RouterService } from '@app/core/router/router.service';
import { render, screen } from '@testing-library/angular';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { MatchWeekMatchesCardComponent } from './match-week-matches-card.component';

const mockRouterService = { navigateToMatch: vi.fn() };
const mockMatchApiService = { getMatchesByMatchWeekId: vi.fn().mockReturnValue(of([])) };
const providers = [
  { provide: RouterService, useValue: mockRouterService },
  { provide: MatchApiService, useValue: mockMatchApiService },
];

@Component({
  template: `<app-match-week-matches-card [matchWeekId]="1" />`,
  standalone: true,
  imports: [MatchWeekMatchesCardComponent],
})
class HostComponent {}

describe('MatchWeekMatchesCardComponent', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('renders', () => {
    beforeEach(async () => {
      await render(HostComponent, { providers });
    });

    it('match week matches card', () => {
      expect(document.querySelector('app-match-week-matches-card')).toBeInTheDocument();
    });

    it('Premier League header', () => {
      expect(screen.getByText('Premier League')).toBeInTheDocument();
    });
  });
});
