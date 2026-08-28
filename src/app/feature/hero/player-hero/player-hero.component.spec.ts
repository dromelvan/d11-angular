import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {
  fakePlayer,
  fakePlayerSeasonStat,
  fakeTeamBase,
  fakeD11TeamBase,
} from '@app/test/faker-util';
import { PlayerActionService } from '@app/core/auth/player-action.service';
import { PlayerHeroComponent } from './player-hero.component';

describe('PlayerHeroComponent', () => {
  describe('more button', () => {
    it('opens player action drawer when clicked', async () => {
      const player = fakePlayer();
      const mockPlayerActionService = {
        drawerVisible: signal(false),
        player: signal(undefined),
        isAdministrator: signal(false),
        loggedIn: signal(false),
        open: vi.fn(),
        close: vi.fn(),
      };

      await render(PlayerHeroComponent, {
        inputs: { player },
        providers: [{ provide: PlayerActionService, useValue: mockPlayerActionService }],
      });

      await userEvent.click(screen.getByRole('button'));

      expect(mockPlayerActionService.open).toHaveBeenCalledWith(player);
    });
  });

  it('renders country name', async () => {
    const player = fakePlayer();

    await render(PlayerHeroComponent, { inputs: { player } });

    expect(screen.getByTestId('country')).toHaveTextContent(player.country.name);
  });

  describe('date of birth', () => {
    it('renders date of birth when set', async () => {
      const player = { ...fakePlayer(), dateOfBirth: '1991-10-03' };

      await render(PlayerHeroComponent, { inputs: { player } });

      expect(screen.getByTestId('date-of-birth')).not.toHaveTextContent('Unknown');
    });

    it('renders Unknown when date of birth is not set', async () => {
      const player = { ...fakePlayer(), dateOfBirth: undefined };

      await render(PlayerHeroComponent, { inputs: { player } });

      expect(screen.getByTestId('date-of-birth')).toHaveTextContent('Unknown');
    });
  });

  describe('with playerSeasonStat', () => {
    it('renders position name', async () => {
      const player = fakePlayer();
      const playerSeasonStat = fakePlayerSeasonStat();

      await render(PlayerHeroComponent, { inputs: { player, playerSeasonStat } });

      expect(screen.getByText(playerSeasonStat.position.name)).toBeInTheDocument();
    });

    it('renders shirt number when team is not dummy', async () => {
      const player = fakePlayer();
      const playerSeasonStat = {
        ...fakePlayerSeasonStat(),
        shirtNumber: 9,
        team: { ...fakeTeamBase(), dummy: false },
      };

      await render(PlayerHeroComponent, { inputs: { player, playerSeasonStat } });

      expect(screen.getByText('#9')).toBeInTheDocument();
    });

    it('does not render shirt number when team is dummy', async () => {
      const player = fakePlayer();
      const playerSeasonStat = {
        ...fakePlayerSeasonStat(),
        shirtNumber: 9,
        team: { ...fakeTeamBase(), dummy: true },
      };

      await render(PlayerHeroComponent, { inputs: { player, playerSeasonStat } });

      expect(screen.queryByText('#9')).toBeNull();
    });

    it('renders fee when d11 team is not dummy', async () => {
      const player = fakePlayer();
      const playerSeasonStat = {
        ...fakePlayerSeasonStat(),
        fee: 5,
        d11Team: { ...fakeD11TeamBase(), dummy: false },
      };

      await render(PlayerHeroComponent, { inputs: { player, playerSeasonStat } });

      expect(screen.getByText(/million/)).toBeInTheDocument();
    });

    it('does not render fee when d11 team is dummy', async () => {
      const player = fakePlayer();
      const playerSeasonStat = {
        ...fakePlayerSeasonStat(),
        d11Team: { ...fakeD11TeamBase(), dummy: true },
      };

      await render(PlayerHeroComponent, { inputs: { player, playerSeasonStat } });

      expect(screen.queryByText(/million/)).toBeNull();
    });
  });
});
