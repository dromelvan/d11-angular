import { Component } from '@angular/core';
import type { PlayerSeasonStat } from '@app/core/api';
import { fakePlayerSeasonStat } from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import { expect } from 'vitest';
import { PlayerSeasonStatCardComponent } from './player-season-stat-card.component';

const renderComponent = (playerSeasonStat: PlayerSeasonStat, showInfo = false) => {
  @Component({
    template: ` <app-player-season-stat-card
      [playerSeasonStat]="playerSeasonStat"
      [showInfo]="showInfo"
    />`,
    standalone: true,
    imports: [PlayerSeasonStatCardComponent],
  })
  class HostComponent {
    playerSeasonStat = playerSeasonStat;
    showInfo = showInfo;
  }

  return render(HostComponent);
};

describe('PlayerSeasonStatCardComponent', () => {
  let pss: PlayerSeasonStat;

  beforeEach(async () => {
    pss = fakePlayerSeasonStat();
    await renderComponent(pss);
  });

  it('renders', () => {
    expect(document.querySelector('.app-player-season-stat-card')).toBeInTheDocument();
  });

  it('renders header with season name', async () => {
    await waitFor(() => {
      expect(screen.getByText(`Stats ${pss.season.name}`)).toBeInTheDocument();
    });
  });

  it('renders player season stat', async () => {
    await waitFor(() => {
      expect(document.querySelector('app-player-season-stat')).toBeInTheDocument();
    });
  });
});
