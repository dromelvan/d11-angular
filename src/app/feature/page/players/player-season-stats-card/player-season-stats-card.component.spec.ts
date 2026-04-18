import { ComponentFixture, TestBed } from '@angular/core/testing';
import { POSITION_IDS, PlayerSeasonStat, PlayerSeasonStatPage } from '@app/core/api';
import { PlayerSeasonStatApiService } from '@app/core/api/player-season-stat/player-season-stat-api.service';
import { PlayerSeasonStatSort } from '@app/core/api/model/player-season-stat-sort.model';
import { LoadingService } from '@app/core/loading/loading.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { RatingPipe } from '@app/shared/pipes/rating.pipe';
import {
  fakeD11TeamBase,
  fakePlayerBase,
  fakePlayerSeasonStat,
  fakePosition,
  fakeSeason,
  fakeTeamBase,
} from '@app/test';
import { screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { Observable, of } from 'rxjs';
import { expect, vi } from 'vitest';
import { PlayerSeasonStatsCardComponent } from './player-season-stats-card.component';

type ApiFn = (
  seasonId: number,
  page: number,
  positionIds: number[],
  dummy: boolean | undefined,
  sort: PlayerSeasonStatSort,
) => Observable<PlayerSeasonStatPage>;

describe('PlayerSeasonStatsCardComponent', () => {
  const mockApi = { getPlayerSeasonStatsBySeasonId: vi.fn<ApiFn>() };
  const mockLoadingService = { register: vi.fn() };
  const mockDynamicDialogService = { openPlayerSeasonStat: vi.fn() };

  const seasonId = 1;
  const allPositionIds = [
    POSITION_IDS.KEEPER,
    POSITION_IDS.DEFENDER,
    POSITION_IDS.MIDFIELDER,
    POSITION_IDS.FORWARD,
    POSITION_IDS.FULL_BACK,
  ];

  let fixture: ComponentFixture<PlayerSeasonStatsCardComponent>;

  const onePage = (
    elements: PlayerSeasonStat[] = [fakePlayerSeasonStat()],
  ): PlayerSeasonStatPage => ({ page: 0, totalPages: 1, totalElements: elements.length, elements });

  const multiPage = (
    elements: PlayerSeasonStat[] = [fakePlayerSeasonStat()],
  ): PlayerSeasonStatPage => ({ page: 0, totalPages: 2, totalElements: 50, elements });

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [PlayerSeasonStatsCardComponent],
      providers: [
        { provide: PlayerSeasonStatApiService, useValue: mockApi },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: DynamicDialogService, useValue: mockDynamicDialogService },
      ],
    }).compileComponents();
  });

  const createFixture = async () => {
    fixture = TestBed.createComponent(PlayerSeasonStatsCardComponent);
    fixture.componentRef.setInput('seasonId', seasonId);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };

  describe('basic rendering', () => {
    let playerSeasonStatPage: PlayerSeasonStatPage;

    beforeEach(async () => {
      playerSeasonStatPage = {
        page: 0,
        totalPages: 2,
        totalElements: 50,
        elements: [
          {
            ...fakePlayerSeasonStat(),
            ranking: 1,
            points: 10,
            rating: 750,
            goals: 3,
            player: { ...fakePlayerBase(), name: 'Player1' },
            team: { ...fakeTeamBase(), shortName: 'Team1' },
            d11Team: fakeD11TeamBase(),
            position: fakePosition(),
            season: fakeSeason(),
          },
          {
            ...fakePlayerSeasonStat(),
            ranking: 2,
            points: 6,
            rating: 700,
            goals: 1,
            player: { ...fakePlayerBase(), name: 'Player2' },
            team: { ...fakeTeamBase(), shortName: 'Team2' },
            d11Team: fakeD11TeamBase(),
            position: fakePosition(),
            season: fakeSeason(),
          },
        ],
      };
      mockApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(playerSeasonStatPage));
      await createFixture();
    });

    it('renders', () => {
      expect(fixture.nativeElement).toBeInTheDocument();
    });

    it('fetches player season stats', () => {
      expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
        seasonId,
        0,
        allPositionIds,
        undefined,
        PlayerSeasonStatSort.RANKING,
      );
    });

    it('renders player names', async () => {
      await waitFor(() => {
        for (const stat of playerSeasonStatPage.elements) {
          expect(screen.getByText(stat.player.name)).toBeInTheDocument();
        }
      });
    });

    it('renders ranking numbers in order', async () => {
      await waitFor(() => {
        const rankingCells = screen.getAllByTestId('ranking');
        const renderedRankings = rankingCells.map((el) => Number(el.textContent?.trim()));
        expect(renderedRankings).toEqual(playerSeasonStatPage.elements.map((s) => s.ranking));
      });
    });

    it('renders points', async () => {
      await waitFor(() => {
        for (const stat of playerSeasonStatPage.elements) {
          expect(screen.getByText(String(stat.points))).toBeInTheDocument();
        }
      });
    });
  });

  describe('pagination', () => {
    it('fetches next page', async () => {
      mockApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(multiPage()));
      await createFixture();

      const [nextButton] = screen.getAllByRole('button', { name: 'Next Page' });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          1,
          allPositionIds,
          undefined,
          PlayerSeasonStatSort.RANKING,
        );
      });
    });

    it('fetches previous page', async () => {
      mockApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(
        of({ page: 1, totalPages: 2, totalElements: 50, elements: [fakePlayerSeasonStat()] }),
      );
      await createFixture();

      const [prevButton] = screen.getAllByRole('button', { name: 'Previous Page' });
      await userEvent.click(prevButton);

      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          allPositionIds,
          undefined,
          PlayerSeasonStatSort.RANKING,
        );
      });
    });
  });

  describe('filters', () => {
    beforeEach(async () => {
      mockApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(onePage()));
      await createFixture();
      await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
    });

    it('calls api with dummy=true', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Available' }));
      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          allPositionIds,
          true,
          PlayerSeasonStatSort.RANKING,
        );
      });
    });

    it('calls api with dummy=false', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Unavailable' }));
      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          allPositionIds,
          false,
          PlayerSeasonStatSort.RANKING,
        );
      });
    });

    it('calls api without Keeper positionId', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Keeper' }));
      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          [
            POSITION_IDS.DEFENDER,
            POSITION_IDS.MIDFIELDER,
            POSITION_IDS.FORWARD,
            POSITION_IDS.FULL_BACK,
          ],
          undefined,
          PlayerSeasonStatSort.RANKING,
        );
      });
    });

    it('calls api without Defender positionIds', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Defender' }));
      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          [POSITION_IDS.KEEPER, POSITION_IDS.MIDFIELDER, POSITION_IDS.FORWARD],
          undefined,
          PlayerSeasonStatSort.RANKING,
        );
      });
    });

    it('calls api without Midfielder positionId', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Midfielder' }));
      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          [
            POSITION_IDS.KEEPER,
            POSITION_IDS.DEFENDER,
            POSITION_IDS.FORWARD,
            POSITION_IDS.FULL_BACK,
          ],
          undefined,
          PlayerSeasonStatSort.RANKING,
        );
      });
    });

    it('calls api without Forward positionId', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Forward' }));
      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          [
            POSITION_IDS.KEEPER,
            POSITION_IDS.DEFENDER,
            POSITION_IDS.MIDFIELDER,
            POSITION_IDS.FULL_BACK,
          ],
          undefined,
          PlayerSeasonStatSort.RANKING,
        );
      });
    });

    it('calls api with GOALS sort', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Goals' }));
      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          allPositionIds,
          undefined,
          PlayerSeasonStatSort.GOALS,
        );
      });
    });

    it('calls api with RATING', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Rating' }));
      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          allPositionIds,
          undefined,
          PlayerSeasonStatSort.RATING,
        );
      });
    });

    it('calls api with FORM', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Form' }));
      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          allPositionIds,
          undefined,
          PlayerSeasonStatSort.FORM,
        );
      });
    });
  });

  describe('sort columns', () => {
    const playerSeasonStats = [
      {
        ...fakePlayerSeasonStat(),
        ranking: 11,
        points: 13,
        goals: 15,
        rating: 170,
        formMatchPoints: [17, -18, 19],
      },
      {
        ...fakePlayerSeasonStat(),
        ranking: 12,
        points: 14,
        goals: 16,
        rating: 180,
        formMatchPoints: [20, -21, 22],
      },
    ];

    beforeEach(async () => {
      mockApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(
        of({ page: 0, totalPages: 1, totalElements: 2, elements: playerSeasonStats }),
      );
      await createFixture();
      await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
    });

    it('default renders points column', async () => {
      expect(screen.getByText('Pts')).toBeInTheDocument();
      expect(screen.getByText(playerSeasonStats[0].ranking)).toBeInTheDocument();
      expect(screen.getByText(playerSeasonStats[0].points)).toBeInTheDocument();
      expect(screen.getByText(playerSeasonStats[1].ranking)).toBeInTheDocument();
      expect(screen.getByText(playerSeasonStats[1].points)).toBeInTheDocument();
    });

    it('no sort renders points column', async () => {
      await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
      await userEvent.click(screen.getByRole('button', { name: 'Goals' }));

      await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
      await userEvent.click(screen.getByRole('button', { name: 'Goals' }));

      expect(screen.getByText('Pts')).toBeInTheDocument();
      expect(screen.getByText(playerSeasonStats[0].points)).toBeInTheDocument();
      expect(screen.getByText(playerSeasonStats[0].ranking)).toBeInTheDocument();
      expect(screen.getByText(playerSeasonStats[1].points)).toBeInTheDocument();
      expect(screen.getByText(playerSeasonStats[1].ranking)).toBeInTheDocument();
    });

    it('GOALS renders goals column', async () => {
      await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
      await userEvent.click(screen.getByRole('button', { name: 'Goals' }));

      expect(screen.getByText('Goals')).toBeInTheDocument();
      expect(screen.getByText(playerSeasonStats[0].goals)).toBeInTheDocument();
      expect(screen.getByText(playerSeasonStats[1].goals)).toBeInTheDocument();
    });

    it('RATING renders ratings column', async () => {
      const pipe = new RatingPipe();
      await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
      await userEvent.click(screen.getByRole('button', { name: 'Rating' }));

      expect(screen.getByText('Rtg')).toBeInTheDocument();
      expect(
        screen.getByText(pipe.transform(playerSeasonStats[0].rating as number) as string),
      ).toBeInTheDocument();
      expect(
        screen.getByText(pipe.transform(playerSeasonStats[1].rating as number) as string),
      ).toBeInTheDocument();
    });

    it('FORM renders form column', async () => {
      await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
      await userEvent.click(screen.getByRole('button', { name: 'Form' }));

      expect(screen.getByText('Form')).toBeInTheDocument();
      for (const pts of [
        ...playerSeasonStats[0].formMatchPoints,
        ...playerSeasonStats[1].formMatchPoints,
      ]) {
        expect(screen.getByText(String(pts))).toBeInTheDocument();
      }
    });
  });

  describe('drawer', () => {
    it('closes when availability filter is changed', async () => {
      mockApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(onePage()));
      await createFixture();

      await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
      expect(screen.getByText('Filter and Sort')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Available' }));

      await waitFor(() => {
        expect(screen.queryByText('Filter and Sort')).not.toBeInTheDocument();
      });
    });

    it('closes when sort filter is changed', async () => {
      mockApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(onePage()));
      await createFixture();

      await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
      expect(screen.getByText('Filter and Sort')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Goals' }));

      await waitFor(() => {
        expect(screen.queryByText('Filter and Sort')).not.toBeInTheDocument();
      });
    });
  });

  describe('page reset', () => {
    it('resets to page 0 when filter changes', async () => {
      mockApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(
        of({ page: 0, totalPages: 3, totalElements: 75, elements: [fakePlayerSeasonStat()] }),
      );
      await createFixture();

      const [nextButton] = screen.getAllByRole('button', { name: 'Next Page' });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          1,
          allPositionIds,
          undefined,
          PlayerSeasonStatSort.RANKING,
        );
      });

      await userEvent.click(screen.getByRole('button', { name: /more_vert/i }));
      await userEvent.click(screen.getByRole('button', { name: 'Goals' }));

      await waitFor(() => {
        expect(mockApi.getPlayerSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasonId,
          0,
          allPositionIds,
          undefined,
          PlayerSeasonStatSort.GOALS,
        );
      });
    });
  });

  describe('open dialog', () => {
    it('opens the dialog with correct params', async () => {
      const stats = [fakePlayerSeasonStat(), fakePlayerSeasonStat()];
      mockApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(
        of({ page: 0, totalPages: 1, totalElements: 2, elements: stats }),
      );
      await createFixture();

      await waitFor(() => {
        expect(document.querySelectorAll('.cursor-pointer')).toHaveLength(stats.length);
      });

      const rows = document.querySelectorAll<HTMLElement>('.cursor-pointer');
      await userEvent.click(rows[0]);

      expect(mockDynamicDialogService.openPlayerSeasonStat).toHaveBeenCalledWith(
        stats[0],
        stats,
        expect.objectContaining({ label: 'Player profile', icon: 'player' }),
      );
    });
  });
});
