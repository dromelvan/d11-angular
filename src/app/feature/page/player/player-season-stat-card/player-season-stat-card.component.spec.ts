import { Component } from '@angular/core';
import type { PlayerSeasonStat } from '@app/core/api';
import { fakePlayerSeasonStat } from '@app/core/api/test/faker-util';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { PlayerSeasonStatCardComponent } from './player-season-stat-card.component';

let playerSeasonStat: PlayerSeasonStat;

@Component({
  template: ` <app-player-season-stat-card [playerSeasonStat]="playerSeasonStat" /> `,
  imports: [PlayerSeasonStatCardComponent],
})
class HostComponent {
  playerSeasonStat = playerSeasonStat;
}

describe('PlayerSeasonStatCardComponent', () => {
  beforeEach(async () => {
    playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.fee = 10;
    await render(HostComponent, {});
  });

  it('renders card', async () => {
    const card = document.querySelector('.app-player-season-stat-card');
    expect(card).toBeInTheDocument();
  });

  it('renders season name', async () => {
    const header = screen.getByText(`Season ${playerSeasonStat.season.name}`);

    expect(header).toBeInTheDocument();
  });

  it('renders fee', async () => {
    expect(screen.getByText('1.0m')).toBeInTheDocument();

    expect(screen.getByText(/Fee/)).toBeInTheDocument();
  });

  it('renders ranking', async () => {
    expect(screen.getByText(`#${playerSeasonStat.ranking}`)).toBeInTheDocument();

    expect(screen.getByText('Ranking')).toBeInTheDocument();
  });

  it('renders points', async () => {
    expect(screen.getByText(playerSeasonStat.points.toString())).toBeInTheDocument();

    expect(screen.getByText('Points')).toBeInTheDocument();
  });
});

describe('PlayerSeasonStatCardComponent with undefined playerSeasonStat', () => {
  it('does not render card', async () => {
    @Component({
      template: ` <app-player-season-stat-card [playerSeasonStat]="playerSeasonStat" /> `,
      imports: [PlayerSeasonStatCardComponent],
    })
    class UndefinedHostComponent {
      playerSeasonStat = undefined;
    }

    await render(UndefinedHostComponent, {});
    const card = document.querySelector('.app-player-season-stat-card');
    expect(card).not.toBeInTheDocument();
  });
});

describe('PlayerSeasonStatCardComponent with no fee', async () => {
  it('does not render fee', async () => {
    playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.fee = 0;

    await render(HostComponent, {});

    expect(screen.getByText('None')).toBeInTheDocument();
  });
});
