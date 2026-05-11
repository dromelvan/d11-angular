import { fakeTeam, fakeTeamSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { TeamHeaderComponent } from './team-header.component';

describe('TeamHeaderComponent', () => {
  let team: ReturnType<typeof fakeTeam>;

  beforeEach(async () => {
    team = { ...fakeTeam(), dummy: false };
    await render(TeamHeaderComponent, { inputs: { team, teamSeasonStat: undefined } });
  });

  it('renders team name', () => {
    expect(screen.getByText(team.name)).toBeInTheDocument();
  });

  it('renders team image', () => {
    expect(screen.getByAltText(team.name)).toBeInTheDocument();
  });

  it('renders stadium', () => {
    expect(screen.getByText(`${team.stadium.name}, ${team.stadium.city}`)).toBeInTheDocument();
  });

  it('does not render stats when teamSeasonStat is undefined', () => {
    expect(document.querySelector('[data-testid="ranking"]')).not.toBeInTheDocument();
  });
});

describe('TeamHeaderComponent with teamSeasonStat', () => {
  let teamSeasonStat: ReturnType<typeof fakeTeamSeasonStat>;

  beforeEach(async () => {
    teamSeasonStat = fakeTeamSeasonStat();
    await render(TeamHeaderComponent, {
      inputs: { team: { ...fakeTeam(), dummy: false }, teamSeasonStat },
    });
  });

  it('renders column headers', () => {
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Pts')).toBeInTheDocument();
    expect(screen.getByText('Form')).toBeInTheDocument();
  });

  it('renders ranking', () => {
    expect(screen.getByTestId('ranking')).toHaveTextContent(String(teamSeasonStat.ranking));
  });

  it('renders points', () => {
    expect(screen.getByTestId('points')).toHaveTextContent(String(teamSeasonStat.points));
  });
});

describe('TeamHeaderComponent with form match points', () => {
  beforeEach(async () => {
    const teamSeasonStat = { ...fakeTeamSeasonStat(), formMatchPoints: [3, 1, 0] };
    await render(TeamHeaderComponent, {
      inputs: { team: { ...fakeTeam(), dummy: false }, teamSeasonStat },
    });
  });

  it('renders a dot for each form match point', () => {
    expect(document.querySelectorAll('.rounded-full')).toHaveLength(3);
  });
});

describe('TeamHeaderComponent with empty form match points', () => {
  beforeEach(async () => {
    const teamSeasonStat = { ...fakeTeamSeasonStat(), formMatchPoints: [] };
    await render(TeamHeaderComponent, {
      inputs: { team: { ...fakeTeam(), dummy: false }, teamSeasonStat },
    });
  });

  it('does not render form dots', () => {
    expect(document.querySelector('.rounded-full')).not.toBeInTheDocument();
  });
});
