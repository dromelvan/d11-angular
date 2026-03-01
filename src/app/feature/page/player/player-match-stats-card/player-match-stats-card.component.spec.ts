import { Component } from '@angular/core';
import { PlayerApiService, type PlayerMatchStat, type PlayerSeasonStat } from '@app/core/api';
import { Lineup } from '@app/core/api/model/lineup.model';
import { fakePlayerMatchStat, fakePlayerSeasonStat } from '@app/core/api/test/faker-util';
import { LoadingService } from '@app/core/loading/loading.service';
import { render, screen, waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { expect } from 'vitest';
import { PlayerMatchStatsCardComponent } from './player-match-stats-card.component';

const renderComponent = (
  playerSeasonStat: PlayerSeasonStat,
  playerMatchStats: PlayerMatchStat[],
) => {
  @Component({
    template: ` <app-player-match-stats [playerSeasonStat]="playerSeasonStat" />`,
    standalone: true,
    imports: [PlayerMatchStatsCardComponent],
  })
  class HostComponent {
    playerSeasonStat = playerSeasonStat;
  }

  const playerApi = {
    getPlayerMatchStatsByPlayerIdAndSeasonId: vi.fn().mockReturnValue(of(playerMatchStats)),
  } as unknown as PlayerApiService;

  const loadingService = { register: vi.fn() } as unknown as LoadingService;

  return render(HostComponent, {
    providers: [
      { provide: PlayerApiService, useValue: playerApi },
      { provide: LoadingService, useValue: loadingService },
    ],
  });
};

describe('PlayerMatchStatsCardComponent', () => {
  let playerSeasonStat: PlayerSeasonStat;
  let playerMatchStats: PlayerMatchStat[];

  beforeEach(async () => {
    playerSeasonStat = fakePlayerSeasonStat();
    playerMatchStats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
    await renderComponent(playerSeasonStat, playerMatchStats);
  });

  it('renders', async () => {
    await waitFor(() => {
      expect(document.querySelector('.app-player-match-stats-card')).toBeInTheDocument();
    });
  });

  it('renders header with season name', async () => {
    await waitFor(() => {
      expect(screen.getByText(`Matches ${playerSeasonStat.season.name}`)).toBeInTheDocument();
    });
  });

  it('renders a row for each match stat', async () => {
    await waitFor(() => {
      const rows = document.querySelectorAll('.app-grid-separator');
      expect(rows).toHaveLength(playerMatchStats.length);
    });
  });

  it('renders rating for normal lineup', async () => {
    playerMatchStats[0].lineup = Lineup.STARTING_LINEUP;
    playerMatchStats[1].lineup = Lineup.DID_NOT_PARTICIPATE;

    await waitFor(() => {
      expect(screen.getByTestId('rating')).toBeInTheDocument();
    });
  });

  it('renders points for normal lineup', async () => {
    playerMatchStats[0].lineup = Lineup.STARTING_LINEUP;
    playerMatchStats[1].lineup = Lineup.DID_NOT_PARTICIPATE;

    await waitFor(() => {
      expect(screen.getByTestId('points')).toBeInTheDocument();
    });
  });
});

describe('PlayerMatchStatsCardComponent with DID_NOT_PARTICIPATE', () => {
  beforeEach(async () => {
    const playerSeasonStat = fakePlayerSeasonStat();
    const stat = fakePlayerMatchStat();
    stat.lineup = Lineup.DID_NOT_PARTICIPATE;
    await renderComponent(playerSeasonStat, [stat]);
  });

  it('renders DNP label', async () => {
    await waitFor(() => {
      expect(screen.getByText('DNP')).toBeInTheDocument();
    });
  });

  it('does not render rating', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('rating')).not.toBeInTheDocument();
    });
  });
});

describe('PlayerMatchStatsCardComponent with unused SUBSTITUTE', () => {
  beforeEach(async () => {
    const playerSeasonStat = fakePlayerSeasonStat();
    const stat = fakePlayerMatchStat();
    stat.lineup = Lineup.SUBSTITUTE;
    stat.substitutionOnTime = 0;
    await renderComponent(playerSeasonStat, [stat]);
  });

  it('renders SUB label', async () => {
    await waitFor(() => {
      expect(screen.getByText('SUB')).toBeInTheDocument();
    });
  });

  it('does not render rating', async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('rating')).not.toBeInTheDocument();
    });
  });
});

describe('PlayerMatchStatsCardComponent with no match stats', () => {
  beforeEach(async () => {
    await renderComponent(fakePlayerSeasonStat(), []);
  });

  it('renders empty message', async () => {
    await waitFor(() => {
      expect(screen.getByText('No matches played this season.')).toBeInTheDocument();
    });
  });
});
