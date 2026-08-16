import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11TeamSeasonStat, Season, SeasonBase, TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerButtonComponent } from '@app/feature/component/season-picker-button/season-picker-button.component';
import { fakeD11TeamSeasonStat, fakeSeason, fakeTeamSeasonStat } from '@app/test';
import { screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TablesPageComponent } from './tables-page.component';

describe('TablesPageComponent', () => {
  const mockSeasonApi = { getAll: vi.fn<() => Observable<Season[]>>() };
  const mockTeamSeasonStatApi = {
    getTeamSeasonStatsBySeasonId: vi.fn<(id: number) => Observable<TeamSeasonStat[]>>(),
  };
  const mockD11TeamSeasonStatApi = {
    getD11TeamSeasonStatsBySeasonId: vi.fn<(id: number) => Observable<D11TeamSeasonStat[]>>(),
  };
  const mockLoadingService = { register: vi.fn() };
  const mockRouterService = { navigateToSeason: vi.fn() };

  let seasons: Season[];
  let teamSeasonStats: TeamSeasonStat[];
  let d11TeamSeasonStats: D11TeamSeasonStat[];
  let fixture: ComponentFixture<TablesPageComponent>;
  let mockCurrentService: {
    season: ReturnType<typeof signal<SeasonBase | undefined>>;
    rxCurrent: { isLoading: ReturnType<typeof signal<boolean>> };
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();

    seasons = [
      { ...fakeSeason(), id: 1 },
      { ...fakeSeason(), id: 2 },
      { ...fakeSeason(), id: 3 },
    ];
    const teamStat1 = fakeTeamSeasonStat();
    const teamStat2 = fakeTeamSeasonStat();
    teamSeasonStats = [
      { ...teamStat1, team: { ...teamStat1.team, id: 1 } },
      { ...teamStat2, team: { ...teamStat2.team, id: 2 } },
    ];
    const d11Stat1 = fakeD11TeamSeasonStat();
    const d11Stat2 = fakeD11TeamSeasonStat();
    d11TeamSeasonStats = [
      { ...d11Stat1, d11Team: { ...d11Stat1.d11Team, id: 1 } },
      { ...d11Stat2, d11Team: { ...d11Stat2.d11Team, id: 2 } },
    ];

    mockSeasonApi.getAll.mockReturnValue(of(seasons));
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of(teamSeasonStats));
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of(d11TeamSeasonStats),
    );

    mockCurrentService = {
      season: signal<SeasonBase | undefined>(seasons[0]),
      rxCurrent: { isLoading: signal(false) },
    };

    await TestBed.configureTestingModule({
      imports: [TablesPageComponent],
      providers: [
        { provide: SeasonApiService, useValue: mockSeasonApi },
        { provide: TeamSeasonStatApiService, useValue: mockTeamSeasonStatApi },
        { provide: D11TeamSeasonStatApiService, useValue: mockD11TeamSeasonStatApi },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: RouterService, useValue: mockRouterService },
        { provide: CurrentService, useValue: mockCurrentService },
      ],
    }).compileComponents();
  });

  describe('with seasonId', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(TablesPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[1].id);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders', () => {
      expect(fixture.nativeElement).toBeInTheDocument();
    });

    it('registers loading state', () => {
      expect(mockLoadingService.register).toHaveBeenCalled();
    });

    it('calls getAll', () => {
      expect(mockSeasonApi.getAll).toHaveBeenCalled();
    });

    it('renders a scroll picker item for the selected season', () => {
      const button = fixture.nativeElement.querySelector(`[data-id="${seasons[1].id}"]`);
      expect(button).toBeInTheDocument();
    });

    it('loads stats for the provided season', async () => {
      await waitFor(() => {
        expect(mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasons[1].id,
        );
        expect(mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasons[1].id,
        );
      });
    });

    it('renders team season stats card', async () => {
      await waitFor(() => {
        expect(screen.getByText('Premier League Table')).toBeInTheDocument();
        for (const stat of teamSeasonStats) {
          expect(screen.getByText(stat.team.name)).toBeInTheDocument();
        }
      });
    });

    it('renders d11 team season stats card', async () => {
      await waitFor(() => {
        expect(screen.getByText('D11 Table')).toBeInTheDocument();
        for (const stat of d11TeamSeasonStats) {
          expect(screen.getByText(stat.d11Team.name)).toBeInTheDocument();
        }
      });
    });

    it('navigates to selected season when a scroll picker item is clicked', async () => {
      await waitFor(() => fixture.nativeElement.querySelector(`[data-id="${seasons[0].id}"]`));
      const button = fixture.nativeElement.querySelector(`[data-id="${seasons[0].id}"]`);
      button.click();

      expect(mockRouterService.navigateToSeason).toHaveBeenCalledWith(seasons[0].id);
    });

    it('navigates to selected season when a season picker button selection is made', () => {
      const pickerButton = fixture.debugElement.query(By.directive(SeasonPickerButtonComponent))
        .componentInstance as SeasonPickerButtonComponent;
      pickerButton.seasonSelected.emit(seasons[0]);

      expect(mockRouterService.navigateToSeason).toHaveBeenCalledWith(seasons[0].id);
    });
  });

  describe('without seasonId', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(TablesPageComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      TestBed.tick();
    });

    it('calls getAll', () => {
      expect(mockSeasonApi.getAll).toHaveBeenCalled();
    });

    it('auto-selects the current season and loads stats', async () => {
      await waitFor(() => {
        expect(mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasons[0].id,
        );
      });
    });

    it('navigates to the current season on auto-select', async () => {
      await waitFor(() => {
        expect(mockRouterService.navigateToSeason).toHaveBeenCalledWith(seasons[0].id);
      });
    });
  });

  describe('empty stats', () => {
    beforeEach(async () => {
      mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of([]));
      mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(of([]));

      fixture = TestBed.createComponent(TablesPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[1].id);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('does not render team season stats section when stats are empty', () => {
      expect(screen.queryByText('Premier League Table')).not.toBeInTheDocument();
    });

    it('does not render d11 team season stats section when stats are empty', () => {
      expect(screen.queryByText('D11 Table')).not.toBeInTheDocument();
    });
  });

  describe('live button', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(TablesPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[1].id);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the Live button', () => {
      expect(screen.getByRole('button', { name: 'Live' })).toBeInTheDocument();
    });

    it('navigates to the current season on Live button click', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Live' }));

      expect(mockRouterService.navigateToSeason).toHaveBeenCalledWith(seasons[0].id);
    });
  });
});
