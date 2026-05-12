import { PlayerSeasonStat, POSITION_IDS } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakeD11TeamBase, fakePlayerSeasonStat, fakeSeason, fakeTeamBase } from '@app/test';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, vi } from 'vitest';
import { TeamPlayerSeasonStatsComponent } from './team-player-season-stats.component';

const mockDynamicDialogService = { openPlayerSeasonStat: vi.fn() };

const providers = [
  { provide: DynamicDialogService, useValue: mockDynamicDialogService },
  { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
];

function fakeStat(positionId: number = POSITION_IDS.KEEPER): PlayerSeasonStat {
  const stat = fakePlayerSeasonStat();
  stat.position.id = positionId;
  return stat;
}

describe('TeamPlayerSeasonStatsComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Heading --------------------------------------------------------------------------------------

  it('renders Players heading without season', async () => {
    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [] },
      providers,
    });

    expect(screen.getByRole('heading', { name: 'Players', level: 2 })).toBeInTheDocument();
  });

  it('renders heading with season name when season is provided', async () => {
    const season = fakeSeason();
    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [], season },
      providers,
    });

    expect(
      screen.getByRole('heading', { name: `Players ${season.name}`, level: 2 }),
    ).toBeInTheDocument();
  });

  // Grouping -------------------------------------------------------------------------------------

  it('renders Goalkeepers group', async () => {
    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [fakeStat(POSITION_IDS.KEEPER)] },
      providers,
    });

    expect(screen.getByText('Goalkeepers')).toBeInTheDocument();
  });

  it('renders Defenders group for DEFENDER position', async () => {
    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [fakeStat(POSITION_IDS.DEFENDER)] },
      providers,
    });

    expect(screen.getByText('Defenders')).toBeInTheDocument();
  });

  it('renders Defenders group for FULL_BACK position', async () => {
    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [fakeStat(POSITION_IDS.FULL_BACK)] },
      providers,
    });

    expect(screen.getByText('Defenders')).toBeInTheDocument();
  });

  it('renders Midfielders group', async () => {
    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [fakeStat(POSITION_IDS.MIDFIELDER)] },
      providers,
    });

    expect(screen.getByText('Midfielders')).toBeInTheDocument();
  });

  it('renders Forwards group', async () => {
    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [fakeStat(POSITION_IDS.FORWARD)] },
      providers,
    });

    expect(screen.getByText('Forwards')).toBeInTheDocument();
  });

  it('does not render group when no players have that position', async () => {
    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [fakeStat(POSITION_IDS.KEEPER)] },
      providers,
    });

    expect(screen.queryByText('Defenders')).not.toBeInTheDocument();
  });

  it('sorts players within group by points descending', async () => {
    const stat1 = fakeStat();
    stat1.points = 10;
    const stat2 = fakeStat();
    stat2.points = 20;

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat1, stat2] },
      providers,
    });

    const pointsCells = screen.getAllByTestId('points');
    expect(pointsCells[0]).toHaveTextContent('20');
    expect(pointsCells[1]).toHaveTextContent('10');
  });

  it('renders empty message when no players', async () => {
    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [] },
      providers,
    });

    expect(screen.getByText('No players found')).toBeInTheDocument();
  });

  it('renders column headers', async () => {
    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [fakeStat()] },
      providers,
    });

    expect(screen.getByText('Rtg')).toBeInTheDocument();
    expect(screen.getByText('Pts')).toBeInTheDocument();
  });

  // Player ---------------------------------------------------------------------------------------

  it('renders player name', async () => {
    const stat = fakeStat();

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(screen.getByText(stat.player.name)).toBeInTheDocument();
  });

  it('renders player avatar', async () => {
    const stat = fakeStat();

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(screen.getByAltText(stat.player.name)).toBeInTheDocument();
  });

  it('renders rating', async () => {
    const stat = fakeStat();
    stat.rating = 750;

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(screen.getByTestId('rating')).toHaveTextContent('7.50');
  });

  it('renders empty rating when rating is zero', async () => {
    const stat = fakeStat();
    stat.rating = 0;

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(screen.getByTestId('rating')).toHaveTextContent('');
  });

  it('renders points', async () => {
    const stat = fakeStat();

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(screen.getByTestId('points')).toHaveTextContent(String(stat.points));
  });

  it('opens dialog when row is clicked', async () => {
    const user = userEvent.setup();
    const stat = fakeStat();

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
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
    const stat = fakeStat();
    stat.d11Team = { ...fakeD11TeamBase(), dummy: false };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(document.querySelector('app-d11-team-img')).toBeInTheDocument();
  });

  it('renders d11 team name when d11 team is not dummy', async () => {
    const stat = fakeStat();
    stat.d11Team = { ...fakeD11TeamBase(), dummy: false };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(screen.getByText(stat.d11Team.name)).toBeInTheDocument();
  });

  it('does not render d11 team name when d11 team is dummy', async () => {
    const stat = fakeStat();
    stat.d11Team = { ...fakeD11TeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(screen.queryByText(stat.d11Team.name)).not.toBeInTheDocument();
  });

  it('renders fee after d11 team name when d11 team is not dummy', async () => {
    const stat = fakeStat();
    stat.d11Team = { ...fakeD11TeamBase(), dummy: false };
    stat.fee = 420;

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(screen.getByTestId('fee')).toHaveTextContent('42.0m');
  });

  it('does not render fee when d11 team is dummy', async () => {
    const stat = fakeStat();
    stat.d11Team = { ...fakeD11TeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(document.querySelector('[data-testid="fee"]')).not.toBeInTheDocument();
  });

  it('vertically centers player name when d11 team is dummy', async () => {
    const stat = fakeStat();
    stat.d11Team = { ...fakeD11TeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat] },
      providers,
    });

    expect(document.querySelector('.justify-center')).toBeInTheDocument();
  });

  // Team (showTeam = true) -----------------------------------------------------------------------

  it('renders team image when showTeam is true and team is not dummy', async () => {
    const stat = fakeStat();
    stat.team = { ...fakeTeamBase(), dummy: false };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat], showTeam: true },
      providers,
    });

    expect(document.querySelector('app-team-img')).toBeInTheDocument();
  });

  it('renders team name when showTeam is true and team is not dummy', async () => {
    const stat = fakeStat();
    stat.team = { ...fakeTeamBase(), dummy: false };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat], showTeam: true },
      providers,
    });

    expect(screen.getByText(stat.team.name)).toBeInTheDocument();
  });

  it('does not render team name when showTeam is true and team is dummy', async () => {
    const stat = fakeStat();
    stat.team = { ...fakeTeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat], showTeam: true },
      providers,
    });

    expect(screen.queryByText(stat.team.name)).not.toBeInTheDocument();
  });

  it('renders fee when showTeam is true and team and d11 team are not dummy', async () => {
    const stat = fakeStat();
    stat.team = { ...fakeTeamBase(), dummy: false };
    stat.d11Team = { ...fakeD11TeamBase(), dummy: false };
    stat.fee = 200;

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat], showTeam: true },
      providers,
    });

    expect(screen.getByTestId('fee')).toHaveTextContent('20.0m');
  });

  it('does not render fee when showTeam is true and team is dummy', async () => {
    const stat = fakeStat();
    stat.team = { ...fakeTeamBase(), dummy: true };
    stat.d11Team = { ...fakeD11TeamBase(), dummy: false };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat], showTeam: true },
      providers,
    });

    expect(document.querySelector('[data-testid="fee"]')).not.toBeInTheDocument();
  });

  it('does not render fee when showTeam is true and d11 team is dummy', async () => {
    const stat = fakeStat();
    stat.team = { ...fakeTeamBase(), dummy: false };
    stat.d11Team = { ...fakeD11TeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat], showTeam: true },
      providers,
    });

    expect(document.querySelector('[data-testid="fee"]')).not.toBeInTheDocument();
  });

  it('vertically centers player name when showTeam is true and team is dummy', async () => {
    const stat = fakeStat();
    stat.team = { ...fakeTeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsComponent, {
      inputs: { playerSeasonStats: [stat], showTeam: true },
      providers,
    });

    expect(document.querySelector('.justify-center')).toBeInTheDocument();
  });
});
