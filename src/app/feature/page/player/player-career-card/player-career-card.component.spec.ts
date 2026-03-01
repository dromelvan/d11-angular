import { Component } from '@angular/core';
import type { PlayerSeasonStat } from '@app/core/api';
import { fakePlayerSeasonStat } from '@app/core/api/test/faker-util';
import { render, screen, waitFor } from '@testing-library/angular';
import { expect } from 'vitest';
import { PlayerCareerCardComponent } from './player-career-card.component';

const renderComponent = (playerSeasonStats: PlayerSeasonStat[]) => {
  @Component({
    template: ` <app-player-career-card [playerSeasonStats]="playerSeasonStats" />`,
    standalone: true,
    imports: [PlayerCareerCardComponent],
  })
  class HostComponent {
    playerSeasonStats = playerSeasonStats;
  }

  return render(HostComponent);
};

describe('PlayerCareerCardComponent', () => {
  let playerSeasonStats: PlayerSeasonStat[];

  beforeEach(async () => {
    playerSeasonStats = [fakePlayerSeasonStat(), fakePlayerSeasonStat()];
    playerSeasonStats.forEach((s) => {
      s.rating = 750;
      s.team.dummy = false;
    });
    await renderComponent(playerSeasonStats);
  });

  it('renders', async () => {
    await waitFor(() => {
      expect(screen.getByText('Career stats')).toBeInTheDocument();
    });
  });

  it('renders season stats', async () => {
    await waitFor(() => {
      expect(document.querySelectorAll('.app-grid-separator')).toHaveLength(
        playerSeasonStats.length,
      );
    });
  });

  it('renders season short name', async () => {
    await waitFor(() => {
      for (const stat of playerSeasonStats) {
        expect(screen.getByText(stat.season.shortName)).toBeInTheDocument();
      }
    });
  });

  it('renders team name when not dummy', async () => {
    await waitFor(() => {
      for (const stat of playerSeasonStats) {
        expect(screen.getByText(stat.team.name)).toBeInTheDocument();
      }
    });
  });
});

describe('PlayerCareerCardComponent with single stat', () => {
  let stat: PlayerSeasonStat;

  beforeEach(async () => {
    stat = fakePlayerSeasonStat();
    stat.rating = 823;
    stat.points = 42;
    stat.team.dummy = false;
    await renderComponent([stat]);
  });

  it('renders ranking', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('ranking').textContent?.trim()).toBe(`#${stat.ranking}`);
    });
  });

  it('renders points', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('points').textContent?.trim()).toBe(String(stat.points));
    });
  });
});

describe('PlayerCareerCardComponent summary', () => {
  it('renders seasons count', async () => {
    const stats = [fakePlayerSeasonStat(), fakePlayerSeasonStat(), fakePlayerSeasonStat()];
    await renderComponent(stats);

    await waitFor(() => {
      expect(screen.getByText('3 seasons')).toBeInTheDocument();
    });
  });

  it('renders total points', async () => {
    const stats = [fakePlayerSeasonStat(), fakePlayerSeasonStat()];
    stats[0].points = 30;
    stats[1].points = 45;
    await renderComponent(stats);

    await waitFor(() => {
      expect(
        screen.getByText('2 seasons').nextElementSibling?.nextElementSibling?.textContent?.trim(),
      ).toBe('75');
    });
  });

  it('renders average rating of rated stats only', async () => {
    const stats = [fakePlayerSeasonStat(), fakePlayerSeasonStat(), fakePlayerSeasonStat()];
    stats[0].rating = 800;
    stats[1].rating = 600;
    stats[2].rating = 0;
    await renderComponent(stats);

    const expectedAvg = (800 + 600) / 2;
    const expectedFormatted = (expectedAvg / 100).toFixed(2);

    await waitFor(() => {
      expect(screen.getByText('3 seasons').nextElementSibling?.textContent?.trim()).toBe(
        expectedFormatted,
      );
    });
  });

  it('does not render average rating when no stats have rating > 0', async () => {
    const stats = [fakePlayerSeasonStat()];
    stats[0].rating = 0;
    await renderComponent(stats);

    await waitFor(() => {
      expect(screen.getByText('1 seasons').nextElementSibling?.textContent?.trim()).toBe('');
    });
  });
});

describe('PlayerCareerCardComponent with no stats', () => {
  beforeEach(async () => {
    await renderComponent([]);
  });

  it('renders empty message', async () => {
    await waitFor(() => {
      expect(screen.getByText('No season stats found')).toBeInTheDocument();
    });
  });
});
