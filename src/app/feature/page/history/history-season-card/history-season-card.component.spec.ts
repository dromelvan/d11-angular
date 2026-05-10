import { ComponentFixture } from '@angular/core/testing';
import { Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeSeasonWinners } from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import { HistorySeasonCardComponent } from './history-season-card.component';

const seasonWinner = {
  ...fakeSeasonWinners(),
  season: { ...fakeSeasonWinners().season, status: Status.FINISHED },
  d11TeamSeasonStat: { ...fakeSeasonWinners().d11TeamSeasonStat, winCount: 1 },
  teamSeasonStat: { ...fakeSeasonWinners().teamSeasonStat, winCount: 1 },
  playerSeasonStat: { ...fakeSeasonWinners().playerSeasonStat, winCount: 1 },
};

const mockRouterService = {
  navigateToD11Team: vi.fn(),
  navigateToPlayer: vi.fn(),
  navigateToTeam: vi.fn(),
};

describe('HistorySeasonCardComponent', () => {
  let fixture: ComponentFixture<HistorySeasonCardComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();

    const result = await render(HistorySeasonCardComponent, {
      providers: [{ provide: RouterService, useValue: mockRouterService }],
      inputs: { seasonWinners: seasonWinner },
    });
    fixture = result.fixture;
  });

  it('renders', () => {
    expect(fixture.nativeElement).toBeInTheDocument();
  });

  it('renders season name', () => {
    expect(screen.getByText(seasonWinner.season.name)).toBeInTheDocument();
  });

  it('renders D11 team name', () => {
    expect(screen.getByText(seasonWinner.d11TeamSeasonStat.d11Team.name)).toBeInTheDocument();
  });

  it('renders D11 team points', () => {
    expect(screen.getByTestId('d11-team-points')).toHaveTextContent(
      String(seasonWinner.d11TeamSeasonStat.points),
    );
  });

  it('renders PL team name', () => {
    expect(screen.getByText(seasonWinner.teamSeasonStat.team.name)).toBeInTheDocument();
  });

  it('renders PL team points', () => {
    expect(screen.getByTestId('team-points')).toHaveTextContent(
      String(seasonWinner.teamSeasonStat.points),
    );
  });

  it('renders player name', () => {
    expect(screen.getByText(seasonWinner.playerSeasonStat.player.name)).toBeInTheDocument();
  });

  it('renders player points', () => {
    expect(screen.getByTestId('player-points')).toHaveTextContent(
      String(seasonWinner.playerSeasonStat.points),
    );
  });

  it('navigates to D11 team on D11 team click', async () => {
    await userEvent.click(screen.getByTestId('d11-team'));

    expect(mockRouterService.navigateToD11Team).toHaveBeenCalledExactlyOnceWith(
      seasonWinner.d11TeamSeasonStat.d11Team.id,
      seasonWinner.season.id,
    );
  });

  it('navigates to PL team on PL team click', async () => {
    await userEvent.click(screen.getByTestId('team'));

    expect(mockRouterService.navigateToTeam).toHaveBeenCalledExactlyOnceWith(
      seasonWinner.teamSeasonStat.team.id,
      seasonWinner.season.id,
    );
  });

  it('navigates to player on player click', async () => {
    await userEvent.click(screen.getByTestId('player'));

    expect(mockRouterService.navigateToPlayer).toHaveBeenCalledExactlyOnceWith(
      seasonWinner.playerSeasonStat.player.id,
      seasonWinner.season.id,
    );
  });

  it('shows winner labels when season is finished', () => {
    expect(screen.getAllByText(/winner/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/leader/i)).not.toBeInTheDocument();
  });

  it('shows leader labels when season is active', async () => {
    fixture.componentRef.setInput('seasonWinners', {
      ...seasonWinner,
      season: { ...seasonWinner.season, status: Status.ACTIVE },
    });

    expect(await screen.findAllByText(/leader/i)).not.toHaveLength(0);
    expect(screen.queryByText(/winner/i)).not.toBeInTheDocument();
  });

  it('shows 1st win when win count is 1 and season is finished', () => {
    expect(screen.getByTestId('d11-team-win-count')).toHaveTextContent('1st win');
    expect(screen.getByTestId('team-win-count')).toHaveTextContent('1st win');
    expect(screen.getByTestId('player-win-count')).toHaveTextContent('1st win');
  });

  it('shows 2nd win when win count is 2', async () => {
    fixture.componentRef.setInput('seasonWinners', {
      ...seasonWinner,
      d11TeamSeasonStat: { ...seasonWinner.d11TeamSeasonStat, winCount: 2 },
      playerSeasonStat: { ...seasonWinner.playerSeasonStat, winCount: 2 },
      teamSeasonStat: { ...seasonWinner.teamSeasonStat, winCount: 2 },
    });

    expect(
      await screen.findByText('2nd win', { selector: '[data-testid="d11-team-win-count"]' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('team-win-count')).toHaveTextContent('2nd win');
    expect(screen.getByTestId('player-win-count')).toHaveTextContent('2nd win');
  });

  it('hides win counts when season is active', async () => {
    fixture.componentRef.setInput('seasonWinners', {
      ...seasonWinner,
      season: { ...seasonWinner.season, status: Status.ACTIVE },
    });

    expect(await screen.findAllByText(/leader/i)).not.toHaveLength(0);
    expect(screen.queryByTestId('d11-team-win-count')).not.toBeInTheDocument();
    expect(screen.queryByTestId('team-win-count')).not.toBeInTheDocument();
    expect(screen.queryByTestId('player-win-count')).not.toBeInTheDocument();
  });

  it('shows winner labels but hides win counts when season is pending', async () => {
    fixture.componentRef.setInput('seasonWinners', {
      ...seasonWinner,
      season: { ...seasonWinner.season, status: Status.PENDING },
    });

    await waitFor(() => expect(screen.queryByTestId('d11-team-win-count')).not.toBeInTheDocument());
    expect(screen.getAllByText(/winner/i)).not.toHaveLength(0);
    expect(screen.queryByTestId('team-win-count')).not.toBeInTheDocument();
    expect(screen.queryByTestId('player-win-count')).not.toBeInTheDocument();
  });
});
