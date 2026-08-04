import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { fakePlayerMatchStat, fakeTeamBase } from '@app/test/faker-util';
import { TeamPlayerMatchStatsSectionComponent } from './team-player-match-stats-section.component';

describe('TeamPlayerMatchStatsSectionComponent', () => {
  it('renders the team name in the section header', async () => {
    const team = fakeTeamBase();

    await render(TeamPlayerMatchStatsSectionComponent, {
      inputs: { team, playerMatchStats: [] },
      providers: [provideRouter([])],
    });

    expect(screen.getByTestId('section-header')).toHaveTextContent(team.name);
  });

  it('renders player name from stats', async () => {
    const team = fakeTeamBase();
    const stat = fakePlayerMatchStat();

    await render(TeamPlayerMatchStatsSectionComponent, {
      inputs: { team, playerMatchStats: [stat] },
      providers: [provideRouter([])],
    });

    expect(screen.getByText(stat.player.name)).toBeInTheDocument();
  });
});
