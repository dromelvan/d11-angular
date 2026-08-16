import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { fakeD11TeamSeasonStat } from '@app/test';
import { D11TeamSeasonStatsSectionComponent } from './d11-team-season-stats-section.component';

describe('D11TeamSeasonStatsSectionComponent', () => {
  it('renders "D11 Table" in the section header', async () => {
    await render(D11TeamSeasonStatsSectionComponent, {
      inputs: { d11TeamSeasonStats: [] },
    });

    expect(screen.getByTestId('section-header')).toHaveTextContent('D11 Table');
  });

  it('renders d11 team name from stats', async () => {
    const stat = fakeD11TeamSeasonStat();

    await render(D11TeamSeasonStatsSectionComponent, {
      inputs: { d11TeamSeasonStats: [stat] },
    });

    expect(screen.getByText(stat.d11Team.name)).toBeInTheDocument();
  });
});
