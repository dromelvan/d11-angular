import { RouterService } from '@app/core/router/router.service';
import { fakePlayerSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect, vi } from 'vitest';
import { PlayerCareerCardComponent } from './player-career-card.component';

const providers = [{ provide: RouterService, useValue: { navigateToPlayer: vi.fn() } }];

describe('PlayerCareerCardComponent', () => {
  it('renders Career stats header', async () => {
    await render(PlayerCareerCardComponent, {
      inputs: { playerSeasonStats: [fakePlayerSeasonStat()] },
      providers,
    });

    expect(screen.getByText('Career stats')).toBeInTheDocument();
  });
});
