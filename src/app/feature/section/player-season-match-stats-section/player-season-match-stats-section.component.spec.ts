import { render, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PlayerApiService } from '@app/core/api';
import { PlayerSeasonMatchStatsAccordionComponent } from '@app/feature/accordion/player-season-match-stats-accordion/player-season-match-stats-accordion.component';
import { PlayerSeasonMatchStatsSectionComponent } from './player-season-match-stats-section.component';

const mockApiService = { getPlayerMatchStatsByPlayerIdAndSeasonId: vi.fn() };

const providers = [{ provide: PlayerApiService, useValue: mockApiService }];

describe('PlayerSeasonMatchStatsSectionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiService.getPlayerMatchStatsByPlayerIdAndSeasonId.mockReturnValue(of([]));
  });

  it('renders Matches header', async () => {
    await render(PlayerSeasonMatchStatsSectionComponent, {
      inputs: { playerId: 1, seasonId: 2 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByTestId('section-header')).toHaveTextContent('Matches');
  });

  it('passes playerId and seasonId to accordion', async () => {
    const { fixture } = await render(PlayerSeasonMatchStatsSectionComponent, {
      inputs: { playerId: 3, seasonId: 7 },
      providers,
    });
    TestBed.tick();

    const accordion = fixture.debugElement.query(
      By.directive(PlayerSeasonMatchStatsAccordionComponent),
    ).componentInstance as PlayerSeasonMatchStatsAccordionComponent;

    expect(accordion.playerId()).toBe(3);
    expect(accordion.seasonId()).toBe(7);
  });
});
