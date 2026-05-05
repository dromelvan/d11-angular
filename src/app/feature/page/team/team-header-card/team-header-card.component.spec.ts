import { fakeTeam, fakeTeamSeasonStat } from '@app/test';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { TeamHeaderCardComponent } from './team-header-card.component';

describe('TeamHeaderCardComponent', () => {
  it('renders', async () => {
    const team = fakeTeam();
    team.dummy = false;

    await render(TeamHeaderCardComponent, { inputs: { team, teamSeasonStat: undefined } });

    expect(document.querySelector('.app-team-header-card')).toBeInTheDocument();
  });

  it('renders team name', async () => {
    const team = fakeTeam();
    team.dummy = false;

    await render(TeamHeaderCardComponent, { inputs: { team, teamSeasonStat: undefined } });

    expect(screen.getByText(team.name)).toBeInTheDocument();
  });

  it('renders team image', async () => {
    const team = fakeTeam();
    team.dummy = false;

    await render(TeamHeaderCardComponent, { inputs: { team, teamSeasonStat: undefined } });

    expect(screen.getByAltText(team.name)).toBeInTheDocument();
  });

  it('renders stadium', async () => {
    const team = fakeTeam();
    team.dummy = false;

    await render(TeamHeaderCardComponent, { inputs: { team, teamSeasonStat: undefined } });

    expect(screen.getByText(`${team.stadium.name}, ${team.stadium.city}`)).toBeInTheDocument();
  });

  it('renders ranking and points when team season stat is provided', async () => {
    const team = fakeTeam();
    team.dummy = false;
    const teamSeasonStat = fakeTeamSeasonStat();

    await render(TeamHeaderCardComponent, { inputs: { team, teamSeasonStat } });

    expect(screen.getByTestId('ranking')).toHaveTextContent(String(teamSeasonStat.ranking));
    expect(screen.getByTestId('points')).toHaveTextContent(String(teamSeasonStat.points));
  });

  it('renders form dots when formMatchPoints has values', async () => {
    const team = fakeTeam();
    team.dummy = false;
    const teamSeasonStat = fakeTeamSeasonStat();
    teamSeasonStat.formMatchPoints = [3, -1, 0];

    await render(TeamHeaderCardComponent, { inputs: { team, teamSeasonStat } });

    const dots = document.querySelectorAll('.rounded-full');
    expect(dots).toHaveLength(3);
  });

  it('does not render form dots when formMatchPoints is empty', async () => {
    const team = fakeTeam();
    team.dummy = false;
    const teamSeasonStat = fakeTeamSeasonStat();
    teamSeasonStat.formMatchPoints = [];

    await render(TeamHeaderCardComponent, { inputs: { team, teamSeasonStat } });

    expect(document.querySelector('.rounded-full')).not.toBeInTheDocument();
  });

  it('does not render stats when team season stat is undefined', async () => {
    const team = fakeTeam();
    team.dummy = false;

    await render(TeamHeaderCardComponent, { inputs: { team, teamSeasonStat: undefined } });

    expect(document.querySelector('[data-testid="ranking"]')).not.toBeInTheDocument();
  });

  it('does not render when team is undefined', async () => {
    await render(TeamHeaderCardComponent, {
      inputs: { team: undefined, teamSeasonStat: undefined },
    });

    expect(document.querySelector('.app-team-header-card')).not.toBeInTheDocument();
  });
});
