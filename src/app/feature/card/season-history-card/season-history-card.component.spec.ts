import { Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeSeasonWinners } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect, vi } from 'vitest';
import { SeasonHistoryCardComponent } from './season-history-card.component';

describe('SeasonHistoryCardComponent', () => {
  const seasonWinners = {
    ...fakeSeasonWinners(),
    season: { ...fakeSeasonWinners().season, status: Status.FINISHED },
  };

  beforeEach(async () => {
    await render(SeasonHistoryCardComponent, {
      inputs: { seasonWinners },
      providers: [
        {
          provide: RouterService,
          useValue: {
            navigateToD11Team: vi.fn(),
            navigateToPlayer: vi.fn(),
            navigateToTeam: vi.fn(),
          },
        },
      ],
    });
  });

  it('renders season name as header', () => {
    expect(screen.getByText(seasonWinners.season.name)).toBeInTheDocument();
  });
});
