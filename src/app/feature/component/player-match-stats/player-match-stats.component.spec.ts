import { PlayerApiService, type PlayerMatchStat, type PlayerSeasonStat } from '@app/core/api';
import { Lineup } from '@app/core/api/model/lineup.model';
import { fakePlayerMatchStat, fakePlayerSeasonStat } from '@app/test';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { PlayerMatchStatsComponent } from './player-match-stats.component';

function buildProviders(
  playerMatchStats: PlayerMatchStat[],
  dynamicDialogService = { openPlayerMatchStat: vi.fn() } as unknown as DynamicDialogService,
) {
  return {
    providers: [
      {
        provide: PlayerApiService,
        useValue: {
          getPlayerMatchStatsByPlayerIdAndSeasonId: vi.fn().mockReturnValue(of(playerMatchStats)),
        },
      },
      { provide: LoadingService, useValue: { register: vi.fn() } },
      { provide: RouterService, useValue: { navigateToMatch: vi.fn() } },
      { provide: DynamicDialogService, useValue: dynamicDialogService },
    ],
    dynamicDialogService,
  };
}

describe('PlayerMatchStatsComponent', () => {
  let playerSeasonStat: PlayerSeasonStat;
  let playerMatchStats: PlayerMatchStat[];

  beforeEach(async () => {
    playerSeasonStat = fakePlayerSeasonStat();
    playerMatchStats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
    const { providers } = buildProviders(playerMatchStats);
    await render(PlayerMatchStatsComponent, { inputs: { playerSeasonStat }, providers });
  });

  it('renders season name header', async () => {
    await waitFor(() => {
      expect(screen.getByText(`Matches ${playerSeasonStat.season.name}`)).toBeInTheDocument();
    });
  });

  it('renders column headers', async () => {
    await waitFor(() => {
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Match')).toBeInTheDocument();
      expect(screen.getByText('Rtg')).toBeInTheDocument();
      expect(screen.getByText('Pts')).toBeInTheDocument();
    });
  });

  it('renders a row for each match stat', async () => {
    await waitFor(() => {
      const rows = document.querySelectorAll('.app-grid-separator');
      expect(rows).toHaveLength(playerMatchStats.length);
    });
  });
});

describe('PlayerMatchStatsComponent with starting lineup', () => {
  beforeEach(async () => {
    const playerSeasonStat = fakePlayerSeasonStat();
    const playerMatchStats = [
      { ...fakePlayerMatchStat(), lineup: Lineup.STARTING_LINEUP, rating: 750 },
      { ...fakePlayerMatchStat(), lineup: Lineup.DID_NOT_PARTICIPATE },
    ];
    const { providers } = buildProviders(playerMatchStats);
    await render(PlayerMatchStatsComponent, { inputs: { playerSeasonStat }, providers });
  });

  it('renders rating', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('rating')).toBeInTheDocument();
      expect(screen.getByText('7.50')).toBeInTheDocument();
    });
  });

  it('renders points', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('points')).toBeInTheDocument();
    });
  });
});

describe('PlayerMatchStatsComponent with active substitute', () => {
  beforeEach(async () => {
    const playerSeasonStat = fakePlayerSeasonStat();
    const stat = { ...fakePlayerMatchStat(), lineup: Lineup.SUBSTITUTE, substitutionOnTime: 60 };
    const { providers } = buildProviders([stat]);
    await render(PlayerMatchStatsComponent, { inputs: { playerSeasonStat }, providers });
  });

  it('renders rating', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('rating')).toBeInTheDocument();
    });
  });

  it('renders points', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('points')).toBeInTheDocument();
    });
  });
});

describe('PlayerMatchStatsComponent with DID_NOT_PARTICIPATE', () => {
  beforeEach(async () => {
    const playerSeasonStat = fakePlayerSeasonStat();
    const stat = { ...fakePlayerMatchStat(), lineup: Lineup.DID_NOT_PARTICIPATE };
    const { providers } = buildProviders([stat]);
    await render(PlayerMatchStatsComponent, { inputs: { playerSeasonStat }, providers });
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

describe('PlayerMatchStatsComponent with unused SUBSTITUTE', () => {
  beforeEach(async () => {
    const playerSeasonStat = fakePlayerSeasonStat();
    const stat = { ...fakePlayerMatchStat(), lineup: Lineup.SUBSTITUTE, substitutionOnTime: 0 };
    const { providers } = buildProviders([stat]);
    await render(PlayerMatchStatsComponent, { inputs: { playerSeasonStat }, providers });
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

describe('PlayerMatchStatsComponent with no match stats', () => {
  beforeEach(async () => {
    const { providers } = buildProviders([]);
    await render(PlayerMatchStatsComponent, {
      inputs: { playerSeasonStat: fakePlayerSeasonStat() },
      providers,
    });
  });

  it('renders empty message', async () => {
    await waitFor(() => {
      expect(screen.getByText('No matches played this season.')).toBeInTheDocument();
    });
  });
});

describe('PlayerMatchStatsComponent open dialog', () => {
  let playerSeasonStat: PlayerSeasonStat;
  let playerMatchStats: PlayerMatchStat[];
  let dynamicDialogService: DynamicDialogService;

  beforeEach(async () => {
    playerSeasonStat = fakePlayerSeasonStat();
    playerMatchStats = [fakePlayerMatchStat(), fakePlayerMatchStat()];
    dynamicDialogService = { openPlayerMatchStat: vi.fn() } as unknown as DynamicDialogService;
    const { providers } = buildProviders(playerMatchStats, dynamicDialogService);
    await render(PlayerMatchStatsComponent, { inputs: { playerSeasonStat }, providers });
  });

  it('opens the dialog with the clicked stat', async () => {
    await waitFor(() => {
      expect(document.querySelectorAll('.app-grid-separator')).toHaveLength(
        playerMatchStats.length,
      );
    });

    const rows = document.querySelectorAll<HTMLElement>('.cursor-pointer');
    await userEvent.click(rows[0]);

    expect(dynamicDialogService.openPlayerMatchStat).toHaveBeenCalledWith(
      playerMatchStats[0],
      playerMatchStats,
      expect.objectContaining({ label: 'Match details', icon: 'match' }),
    );
  });

  it('passes all match stats as the list', async () => {
    await waitFor(() => {
      expect(document.querySelectorAll('.app-grid-separator')).toHaveLength(
        playerMatchStats.length,
      );
    });

    const rows = document.querySelectorAll<HTMLElement>('.cursor-pointer');
    await userEvent.click(rows[0]);

    const openMock = dynamicDialogService.openPlayerMatchStat as ReturnType<typeof vi.fn>;
    const [, list] = openMock.mock.calls[0];
    expect(list).toBe(playerMatchStats);
  });
});
