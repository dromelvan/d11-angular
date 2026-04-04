import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PlayerDialogSeasonStatComponent } from './player-dialog-season-stat.component';
import { fakePlayerSeasonStat } from '@app/test';

function fakeConfig(playerSeasonStat = fakePlayerSeasonStat()) {
  return {
    data: {
      current: signal(playerSeasonStat),
      list: [playerSeasonStat],
    },
  };
}

async function setup(playerSeasonStat = fakePlayerSeasonStat()) {
  const config = fakeConfig(playerSeasonStat);
  await render(PlayerDialogSeasonStatComponent, {
    providers: [{ provide: DynamicDialogConfig, useValue: config }],
  });
  return config;
}

describe('PlayerDialogSeasonStatComponent', () => {
  describe('player info', () => {
    it('renders position name', async () => {
      const playerSeasonStat = fakePlayerSeasonStat();

      await setup(playerSeasonStat);

      expect(screen.getByText(playerSeasonStat.position.name)).toBeInTheDocument();
    });
  });

  describe('ranking', () => {
    it('renders ranking', async () => {
      const playerSeasonStat = fakePlayerSeasonStat();

      await setup(playerSeasonStat);

      expect(screen.getByText(`#${playerSeasonStat.ranking}`)).toBeInTheDocument();
    });
  });

  describe('points', () => {
    it('renders points', async () => {
      const playerSeasonStat = fakePlayerSeasonStat();
      playerSeasonStat.points = 42;

      await setup(playerSeasonStat);

      const element = screen.getByText('Points');
      expect(element).toBeInTheDocument();
      expect(element.nextElementSibling).toHaveTextContent('42');
    });
  });
});
