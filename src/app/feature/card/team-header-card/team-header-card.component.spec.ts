import { fakeTeam } from '@app/test';
import { render } from '@testing-library/angular';
import { expect } from 'vitest';
import { TeamHeaderCardComponent } from './team-header-card.component';

describe('TeamHeaderCardComponent', () => {
  it('renders', async () => {
    const team = { ...fakeTeam(), dummy: false };

    await render(TeamHeaderCardComponent, { inputs: { team, teamSeasonStat: undefined } });

    expect(document.querySelector('.app-team-header-card')).toBeInTheDocument();
  });

  it('does not render when team is undefined', async () => {
    await render(TeamHeaderCardComponent, {
      inputs: { team: undefined, teamSeasonStat: undefined },
    });

    expect(document.querySelector('.app-team-header-card')).not.toBeInTheDocument();
  });
});
