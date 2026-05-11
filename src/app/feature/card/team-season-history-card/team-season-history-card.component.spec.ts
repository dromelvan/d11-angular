import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { TeamSeasonHistoryCardComponent } from './team-season-history-card.component';

describe('TeamSeasonHistoryCardComponent', () => {
  it('renders "Season history" header', async () => {
    await render(TeamSeasonHistoryCardComponent, {
      inputs: { teamSeasonStats: [], currentSeasonId: undefined },
    });

    expect(screen.getByText('Season history')).toBeInTheDocument();
  });
});
