import {
  type Player,
  PlayerApiService,
  type PlayerSeasonStat,
  type PlayerTransferContext,
} from '@app/core/api';
import { PlayerActionService } from '@app/core/auth/player-action.service';
import { UserActionService } from '@app/core/auth/user-action.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayer, fakePlayerSeasonStat } from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { computed, signal } from '@angular/core';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { PlayerHeaderComponent } from './player-header.component';

function buildProviders(transferContext: PlayerTransferContext, isAdministrator = false) {
  const playerActionMock = {
    drawerVisible: signal(false),
    player: signal<Player | undefined>(undefined),
    isAdministrator: signal(false),
    open: vi.fn(),
    close: vi.fn(),
  };
  const providers = [
    {
      provide: PlayerApiService,
      useValue: {
        getPlayerTransferContextByPlayerId: vi.fn().mockReturnValue(of(transferContext)),
      },
    },
    {
      provide: UserActionService,
      useValue: { isAdministrator: computed(() => isAdministrator) },
    },
    { provide: PlayerActionService, useValue: playerActionMock },
    { provide: RouterService, useValue: { navigateToEditPlayer: vi.fn() } },
    { provide: LoadingService, useValue: { register: vi.fn() } },
  ];
  return { providers, playerActionMock };
}

const noActionContext = (): PlayerTransferContext => ({
  transferListable: false,
  maxBid: 0,
});

describe('PlayerHeaderComponent', () => {
  let player: Player;
  let playerSeasonStat: PlayerSeasonStat;

  beforeEach(async () => {
    player = { ...fakePlayer(), firstName: 'TestFirst' };
    playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.team.dummy = false;
    playerSeasonStat.d11Team.dummy = false;

    const { providers } = buildProviders(noActionContext(), true);
    await render(PlayerHeaderComponent, { inputs: { player, playerSeasonStat }, providers });
  });

  it('renders player image', () => {
    expect(screen.getByAltText(player.name)).toBeInTheDocument();
  });

  it('renders player last name', () => {
    expect(screen.getByText(player.lastName)).toBeInTheDocument();
  });

  it('renders player first name', () => {
    expect(screen.getByText('TestFirst')).toBeInTheDocument();
  });

  it('renders position', () => {
    expect(screen.getByText(playerSeasonStat.position.name)).toBeInTheDocument();
  });

  it('renders team', () => {
    expect(screen.getByText(playerSeasonStat.team.name)).toBeInTheDocument();
    expect(screen.getByAltText(playerSeasonStat.team.name)).toBeInTheDocument();
  });

  it('renders d11 team', () => {
    expect(screen.getByText(playerSeasonStat.d11Team.name)).toBeInTheDocument();
    expect(screen.getByAltText(playerSeasonStat.d11Team.name)).toBeInTheDocument();
  });
});

describe('PlayerHeaderComponent with dummies', () => {
  beforeEach(async () => {
    const playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.team.dummy = true;
    playerSeasonStat.d11Team.dummy = true;

    const { providers } = buildProviders(noActionContext());
    await render(PlayerHeaderComponent, {
      inputs: { player: fakePlayer(), playerSeasonStat },
      providers,
    });
  });

  it('does not render dummy team', () => {
    expect(document.querySelector('.team-base')).not.toBeInTheDocument();
  });

  it('does not render dummy d11 team', () => {
    expect(document.querySelector('.d11-team-base')).not.toBeInTheDocument();
  });
});

describe('PlayerHeaderComponent without first name', () => {
  it('does not render first name element', async () => {
    const player = { ...fakePlayer(), firstName: '' };
    const { providers } = buildProviders(noActionContext());

    await render(PlayerHeaderComponent, {
      inputs: { player, playerSeasonStat: fakePlayerSeasonStat() },
      providers,
    });

    expect(document.querySelector('h1.text-2xl')).not.toBeInTheDocument();
  });
});

describe('PlayerHeaderComponent with undefined playerSeasonStat', () => {
  it('does not render player season stats', async () => {
    const { providers } = buildProviders(noActionContext());

    await render(PlayerHeaderComponent, {
      inputs: { player: fakePlayer(), playerSeasonStat: undefined },
      providers,
    });

    expect(document.querySelector('.position')).not.toBeInTheDocument();
    expect(document.querySelector('.team-base')).not.toBeInTheDocument();
    expect(document.querySelector('.d11-team-base')).not.toBeInTheDocument();
  });
});

describe('PlayerHeaderComponent player action button', () => {
  it('shows more_vert button when administrator', async () => {
    const { providers } = buildProviders(noActionContext(), true);
    await render(PlayerHeaderComponent, {
      inputs: { player: fakePlayer(), playerSeasonStat: fakePlayerSeasonStat() },
      providers,
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /more_vert/i })).toBeInTheDocument();
    });
  });

  it('shows more_vert button when playerId is defined', async () => {
    const { providers } = buildProviders({ ...noActionContext(), playerId: 1 });
    await render(PlayerHeaderComponent, {
      inputs: { player: fakePlayer(), playerSeasonStat: fakePlayerSeasonStat() },
      providers,
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /more_vert/i })).toBeInTheDocument();
    });
  });

  it('hides more_vert button when no playerId and not administrator', async () => {
    const { providers } = buildProviders(noActionContext());
    await render(PlayerHeaderComponent, {
      inputs: { player: fakePlayer(), playerSeasonStat: fakePlayerSeasonStat() },
      providers,
    });

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /more_vert/i })).not.toBeInTheDocument();
    });
  });

  it('calls playerActionService.open() with player and context when more_vert is clicked', async () => {
    const player = fakePlayer();
    const transferContext = { ...noActionContext(), playerId: 1 };
    const { providers, playerActionMock } = buildProviders(transferContext);

    await render(PlayerHeaderComponent, {
      inputs: { player, playerSeasonStat: fakePlayerSeasonStat() },
      providers,
    });

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /more_vert/i })).toBeInTheDocument(),
    );
    await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));

    expect(playerActionMock.open).toHaveBeenCalledWith(player, transferContext);
  });
});
