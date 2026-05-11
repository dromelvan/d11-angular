import { fakeD11TeamSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { D11TeamSeasonHistoryCardComponent } from './d11-team-season-history-card.component';

describe('D11TeamSeasonHistoryCardComponent', () => {
  it('renders Season history header', async () => {
    await render(D11TeamSeasonHistoryCardComponent, {
      inputs: { d11TeamSeasonStats: [fakeD11TeamSeasonStat()], currentSeasonId: undefined },
    });

    expect(screen.getByText('Season history')).toBeInTheDocument();
  });
});
