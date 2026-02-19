import { Component } from '@angular/core';
import type { Player, PlayerSeasonStat } from '@app/core/api';
import { fakePlayer, fakePlayerSeasonStat } from '@app/core/api/test/faker-util';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { PlayerHeaderCardComponent } from './player-header-card.component';

let player: Player | undefined;
let playerSeasonStat: PlayerSeasonStat | undefined;

@Component({
  template: ` <app-player-header-card [player]="player" [playerSeasonStat]="playerSeasonStat" /> `,
  standalone: true,
  imports: [PlayerHeaderCardComponent],
})
class HostComponent {
  player = player;
  playerSeasonStat = playerSeasonStat;
}

describe('PlayerHeaderCardComponent', () => {
  beforeEach(async () => {
    player = fakePlayer();
    playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.team.dummy = false;
    playerSeasonStat.d11Team.dummy = false;
    await render(HostComponent, {});
  });

  it('renders', async () => {
    const card = document.querySelector('.app-player-header-card');
    expect(card).toBeInTheDocument();
  });

  it('renders player', async () => {
    if (player?.firstName) {
      expect(screen.getByText(player.firstName)).toBeInTheDocument();
    }
    expect(screen.getByText(player!.lastName)).toBeInTheDocument();

    expect(screen.getByAltText(player!.name)).toBeInTheDocument();
  });

  it('renders position', async () => {
    const position = screen.getByText(playerSeasonStat!.position.name);

    expect(position).toBeInTheDocument();
  });

  it('renders team', async () => {
    const team = screen.getByText(playerSeasonStat!.team.name);
    expect(team).toBeInTheDocument();

    const img = screen.getByAltText(playerSeasonStat!.team.name);
    expect(img).toBeInTheDocument();
  });

  it('renders d11 team', async () => {
    const d11Team = screen.getByText(playerSeasonStat!.d11Team.name);
    expect(d11Team).toBeInTheDocument();

    const img = screen.getByAltText(playerSeasonStat!.d11Team.name);
    expect(img).toBeInTheDocument();
  });

  it('renders context button', async () => {
    const button = document.querySelector('.pi-ellipsis-v');
    expect(button).toBeInTheDocument();
  });
});

describe('PlayerHeaderCardComponent with undefined player', () => {
  it('does not render', async () => {
    player = undefined;
    await render(HostComponent, {});

    const card = document.querySelector('.app-player-header-card');
    expect(card).not.toBeInTheDocument();
  });
});

describe('PlayerHeaderCardComponent with dummies', () => {
  beforeEach(async () => {
    player = fakePlayer();
    playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.team.dummy = true;
    playerSeasonStat.d11Team.dummy = true;
    await render(HostComponent, {});
  });

  it('does not render dummy team', async () => {
    expect(document.querySelector('.team')).not.toBeInTheDocument();
    expect(document.querySelector('.team-img')).not.toBeInTheDocument();
  });

  it('does not render dummy d11 team', async () => {
    expect(document.querySelector('.d11-team')).not.toBeInTheDocument();
    expect(document.querySelector('.d11-team-img')).not.toBeInTheDocument();
  });
});

describe('PlayerHeaderCardComponent with undefined playerSeasonStat', () => {
  it('does not render player season stats', async () => {
    player = fakePlayer();
    playerSeasonStat = undefined;
    await render(HostComponent, {});

    expect(document.querySelector('.position')).not.toBeInTheDocument();
    expect(document.querySelector('.team')).not.toBeInTheDocument();
    expect(document.querySelector('.team-img')).not.toBeInTheDocument();
    expect(document.querySelector('.d11-team')).not.toBeInTheDocument();
    expect(document.querySelector('.d11-team-img')).not.toBeInTheDocument();
  });
});
