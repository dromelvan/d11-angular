import { Component } from '@angular/core';
import type { PlayerSeasonStat } from '@app/core/api';
import { fakePlayerSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { PlayerSeasonSummaryCardComponent } from './player-season-summary-card.component';

let playerSeasonStat: PlayerSeasonStat;

@Component({
  template: ` <app-player-season-summary-card [playerSeasonStat]="playerSeasonStat" /> `,
  imports: [PlayerSeasonSummaryCardComponent],
})
class HostComponent {
  playerSeasonStat = playerSeasonStat;
}

describe('PlayerSeasonSummaryCardComponent', () => {
  beforeEach(async () => {
    playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.fee = 10;
    await render(HostComponent, {});
  });

  it('renders card', async () => {
    const card = document.querySelector('.app-player-season-summary-card');
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

describe('PlayerSeasonSummaryCardComponent with undefined playerSeasonStat', () => {
  it('does not render card', async () => {
    @Component({
      template: ` <app-player-season-summary-card [playerSeasonStat]="playerSeasonStat" /> `,
      imports: [PlayerSeasonSummaryCardComponent],
    })
    class UndefinedHostComponent {
      playerSeasonStat = undefined;
    }

    await render(UndefinedHostComponent, {});
    const card = document.querySelector('.app-player-season-summary-card');
    expect(card).not.toBeInTheDocument();
  });
});

describe('PlayerSeasonSummaryCardComponent with no fee', async () => {
  it('does not render fee', async () => {
    playerSeasonStat = fakePlayerSeasonStat();
    playerSeasonStat.fee = 0;

    await render(HostComponent, {});

    expect(screen.getByText('None')).toBeInTheDocument();
  });
});
