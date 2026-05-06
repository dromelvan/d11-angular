import { fakeD11TeamBase, fakePlayerSeasonStat, fakeSeason, fakeTeamBase } from '@app/test';
import { POSITION_IDS } from '@app/core/api';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { TeamPlayerSeasonStatsCardComponent } from './team-player-season-stats-card.component';

const mockDynamicDialogService = { openPlayerSeasonStat: vi.fn() };

const providers = [{ provide: DynamicDialogService, useValue: mockDynamicDialogService }];

describe('TeamPlayerSeasonStatsCardComponent', () => {
  // Header ---------------------------------------------------------------------------------------

  it('renders "Players <season>" header when season is provided', async () => {
    const season = fakeSeason();

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [], season },
      providers,
    });

    expect(screen.getByText(`Players ${season.name}`)).toBeInTheDocument();
  });

  it('renders "Players" header when no season', async () => {
    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [], season: undefined },
      providers,
    });

    expect(screen.getByText('Players')).toBeInTheDocument();
  });

  // Grouping -------------------------------------------------------------------------------------

  it('renders Goalkeepers group', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByText('Goalkeepers')).toBeInTheDocument();
  });

  it('renders Defenders group for DEFENDER position', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.DEFENDER;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByText('Defenders')).toBeInTheDocument();
  });

  it('renders Defenders group for FULL_BACK position', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.FULL_BACK;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByText('Defenders')).toBeInTheDocument();
  });

  it('renders Midfielders group', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.MIDFIELDER;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByText('Midfielders')).toBeInTheDocument();
  });

  it('renders Forwards group', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.FORWARD;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByText('Forwards')).toBeInTheDocument();
  });

  it('does not render group when no players have that position', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.queryByText('Defenders')).not.toBeInTheDocument();
  });

  it('sorts players within group by points descending', async () => {
    const stat1 = fakePlayerSeasonStat();
    stat1.position.id = POSITION_IDS.KEEPER;
    stat1.points = 10;
    const stat2 = fakePlayerSeasonStat();
    stat2.position.id = POSITION_IDS.KEEPER;
    stat2.points = 20;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat1, stat2], season: undefined },
      providers,
    });

    const pointsCells = screen.getAllByTestId('points');
    expect(pointsCells[0]).toHaveTextContent('20');
    expect(pointsCells[1]).toHaveTextContent('10');
  });

  it('renders empty message when no players', async () => {
    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [], season: undefined },
      providers,
    });

    expect(screen.getByText('No players found')).toBeInTheDocument();
  });

  // Player ---------------------------------------------------------------------------------------

  it('renders player name', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByText(stat.player.name)).toBeInTheDocument();
  });

  it('renders player avatar', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByAltText(stat.player.name)).toBeInTheDocument();
  });

  it('renders rating', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.rating = 750;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByTestId('rating')).toHaveTextContent('7.50');
  });

  it('renders empty rating when rating is zero', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.rating = 0;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByTestId('rating')).toHaveTextContent('');
  });

  it('renders points', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByTestId('points')).toHaveTextContent(String(stat.points));
  });

  it('opens dialog when row is clicked', async () => {
    const user = userEvent.setup();
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    await user.click(screen.getByText(stat.player.name));

    expect(mockDynamicDialogService.openPlayerSeasonStat).toHaveBeenCalledWith(
      stat,
      [stat],
      expect.any(Object),
    );
  });

  // D11 team (showTeam = false) ------------------------------------------------------------------

  it('renders d11 team image when d11 team is not dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.d11Team = { ...fakeD11TeamBase(), dummy: false };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(document.querySelector('app-d11-team-img')).toBeInTheDocument();
  });

  it('renders d11 team name when d11 team is not dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.d11Team.dummy = false;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByText(stat.d11Team.name)).toBeInTheDocument();
  });

  it('does not render d11 team name when d11 team is dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.d11Team = { ...fakeD11TeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.queryByText(stat.d11Team.name)).not.toBeInTheDocument();
  });

  it('renders fee after d11 team name when d11 team is not dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.d11Team.dummy = false;
    stat.fee = 420;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByTestId('fee')).toHaveTextContent('42.0m');
  });

  it('does not render fee when d11 team is dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.d11Team = { ...fakeD11TeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(document.querySelector('[data-testid="fee"]')).not.toBeInTheDocument();
  });

  it('vertically centers player name when d11 team is dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.d11Team = { ...fakeD11TeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(document.querySelector('.justify-center')).toBeInTheDocument();
  });

  // Team (showTeam = true) -----------------------------------------------------------------------

  it('renders team image when showTeam is true and team is not dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.team = { ...fakeTeamBase(), dummy: false };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined, showTeam: true },
      providers,
    });

    expect(document.querySelector('app-team-img')).toBeInTheDocument();
  });

  it('renders team name when showTeam is true and team is not dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.team = { ...fakeTeamBase(), dummy: false };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined, showTeam: true },
      providers,
    });

    expect(screen.getByText(stat.team.name)).toBeInTheDocument();
  });

  it('does not render team name when showTeam is true and team is dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.team = { ...fakeTeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined, showTeam: true },
      providers,
    });

    expect(screen.queryByText(stat.team.name)).not.toBeInTheDocument();
  });

  it('renders fee when showTeam is true and team and d11 team are not dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.team = { ...fakeTeamBase(), dummy: false };
    stat.d11Team = { ...fakeD11TeamBase(), dummy: false };
    stat.fee = 200;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined, showTeam: true },
      providers,
    });

    expect(screen.getByTestId('fee')).toHaveTextContent('20.0m');
  });

  it('does not render fee when showTeam is true and team is dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.team = { ...fakeTeamBase(), dummy: true };
    stat.d11Team = { ...fakeD11TeamBase(), dummy: false };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined, showTeam: true },
      providers,
    });

    expect(document.querySelector('[data-testid="fee"]')).not.toBeInTheDocument();
  });

  it('does not render fee when showTeam is true and d11 team is dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.team = { ...fakeTeamBase(), dummy: false };
    stat.d11Team = { ...fakeD11TeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined, showTeam: true },
      providers,
    });

    expect(document.querySelector('[data-testid="fee"]')).not.toBeInTheDocument();
  });

  it('vertically centers player name when showTeam is true and team is dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.team = { ...fakeTeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined, showTeam: true },
      providers,
    });

    expect(document.querySelector('.justify-center')).toBeInTheDocument();
  });
});
