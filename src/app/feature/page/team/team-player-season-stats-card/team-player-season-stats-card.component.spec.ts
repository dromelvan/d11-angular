import { fakeD11TeamBase, fakePlayerSeasonStat, fakeSeason } from '@app/test';
import { POSITION_IDS } from '@app/core/api';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { TeamPlayerSeasonStatsCardComponent } from './team-player-season-stats-card.component';

const mockDynamicDialogService = { openPlayerSeasonStat: vi.fn() };

const providers = [{ provide: DynamicDialogService, useValue: mockDynamicDialogService }];

describe('TeamPlayerSeasonStatsCardComponent', () => {
  it('renders players grouped by position', async () => {
    const season = fakeSeason();
    const goalkeeper = fakePlayerSeasonStat();
    goalkeeper.position.id = POSITION_IDS.KEEPER;
    const defender = fakePlayerSeasonStat();
    defender.position.id = POSITION_IDS.DEFENDER;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [goalkeeper, defender], season },
      providers,
    });

    expect(screen.getByText(`Players ${season.name}`)).toBeInTheDocument();
    expect(screen.getByText('Goalkeepers')).toBeInTheDocument();
    expect(screen.getByText('Defenders')).toBeInTheDocument();
  });

  it('renders "Players" header when no season', async () => {
    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [], season: undefined },
      providers,
    });

    expect(screen.getByText('Players')).toBeInTheDocument();
  });

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

  it('renders d11 team name when not dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.d11Team.dummy = false;

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.getByText(stat.d11Team.name)).toBeInTheDocument();
  });

  it('does not render d11 team name when dummy', async () => {
    const stat = fakePlayerSeasonStat();
    stat.position.id = POSITION_IDS.KEEPER;
    stat.d11Team = { ...fakeD11TeamBase(), dummy: true };

    await render(TeamPlayerSeasonStatsCardComponent, {
      inputs: { playerSeasonStats: [stat], season: undefined },
      providers,
    });

    expect(screen.queryByText(stat.d11Team.name)).not.toBeInTheDocument();
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
});
