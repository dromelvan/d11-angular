import { render, screen } from '@testing-library/angular';
import { describe, expect, it } from 'vitest';
import { fakeTeamSeasonStat } from '@app/test';
import { TeamSeasonStatsSectionComponent } from './team-season-stats-section.component';

describe('TeamSeasonStatsSectionComponent', () => {
  it('renders "Premier League Table" in the section header', async () => {
    await render(TeamSeasonStatsSectionComponent, {
      inputs: { teamSeasonStats: [] },
    });

    expect(screen.getByTestId('section-header')).toHaveTextContent('Premier League Table');
  });

  it('renders team name from stats', async () => {
    const stat = fakeTeamSeasonStat();

    await render(TeamSeasonStatsSectionComponent, {
      inputs: { teamSeasonStats: [stat] },
    });

    expect(screen.getByText(stat.team.name)).toBeInTheDocument();
  });
});
