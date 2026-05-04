import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11TeamSeasonStat, Season, TeamSeasonStat } from '@app/core/api';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { TeamSeasonStatApiService } from '@app/core/api/team-season-stat/team-season-stat-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeD11TeamSeasonStat, fakeSeason, fakeTeamSeasonStat } from '@app/test';
import { screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Observable, of } from 'rxjs';
import { expect, vi } from 'vitest';
import { SeasonPageComponent } from './season-page.component';

describe('SeasonPageComponent', () => {
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
  let fixture: ComponentFixture<SeasonPageComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    seasons = [
      { ...fakeSeason(), id: 1, date: '2023-08-01' },
      { ...fakeSeason(), id: 2, date: '2022-08-01' },
      { ...fakeSeason(), id: 3, date: '2021-08-01' },
    ];
    teamSeasonStats = [fakeTeamSeasonStat(), fakeTeamSeasonStat()];
    d11TeamSeasonStats = [fakeD11TeamSeasonStat(), fakeD11TeamSeasonStat()];
    mockSeasonApi.getAll.mockReturnValue(of(seasons));
    mockTeamSeasonStatApi.getTeamSeasonStatsBySeasonId.mockReturnValue(of(teamSeasonStats));
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of(d11TeamSeasonStats),
    );

    await TestBed.configureTestingModule({
      imports: [SeasonPageComponent],
      providers: [
        { provide: SeasonApiService, useValue: mockSeasonApi },
        { provide: TeamSeasonStatApiService, useValue: mockTeamSeasonStatApi },
        { provide: D11TeamSeasonStatApiService, useValue: mockD11TeamSeasonStatApi },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();
  });

  describe('with seasonId', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SeasonPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[1].id);
      fixture.detectChanges();
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(fixture.nativeElement.querySelector('.app-season-page')).toBeInTheDocument();
      });
    });

    it('gets all seasons', () => {
      expect(mockSeasonApi.getAll).toHaveBeenCalled();
    });

    it('renders season name', async () => {
      await waitFor(() => {
        expect(screen.getByText(seasons[1].name, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders team season stats card', async () => {
      await waitFor(() => {
        expect(screen.getByText('Premier League')).toBeInTheDocument();
        for (const stat of teamSeasonStats) {
          const expectedName = stat.team.name.length > 22 ? stat.team.shortName : stat.team.name;
          expect(screen.getByText(expectedName)).toBeInTheDocument();
        }
      });
    });

    it('renders d11 team season stats card', async () => {
      await waitFor(() => {
        expect(screen.getByText('D11')).toBeInTheDocument();
        for (const stat of d11TeamSeasonStats) {
          expect(screen.getByText(stat.d11Team.name)).toBeInTheDocument();
        }
      });
    });

    it('navigates to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[1].name, { exact: false }));
      const [prevButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(mockRouterService.navigateToSeason).toHaveBeenCalledExactlyOnceWith(seasons[2].id);
    });

    it('navigates to next season on next button click', async () => {
      await waitFor(() => screen.getByText(seasons[1].name, { exact: false }));
      const [, nextButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(nextButton);

      expect(mockRouterService.navigateToSeason).toHaveBeenCalledExactlyOnceWith(seasons[0].id);
    });
  });

  describe('without seasonId', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SeasonPageComponent);
      fixture.detectChanges();
    });

    it('gets all seasons', () => {
      expect(mockSeasonApi.getAll).toHaveBeenCalled();
    });

    it('renders most recent season name', async () => {
      await waitFor(() => {
        expect(screen.getByText(seasons[0].name, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders team season stats card', async () => {
      await waitFor(() => {
        expect(screen.getByText('Premier League')).toBeInTheDocument();
        for (const stat of teamSeasonStats) {
          const expectedName = stat.team.name.length > 22 ? stat.team.shortName : stat.team.name;
          expect(screen.getByText(expectedName)).toBeInTheDocument();
        }
      });
    });

    it('renders d11 team season stats card', async () => {
      await waitFor(() => {
        expect(screen.getByText('D11')).toBeInTheDocument();
        for (const stat of d11TeamSeasonStats) {
          expect(screen.getByText(stat.d11Team.name)).toBeInTheDocument();
        }
      });
    });
  });

  describe('at last season', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SeasonPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[0].id);
      fixture.detectChanges();
    });

    it('does not navigate to next season on next button click', async () => {
      await waitFor(() => screen.getByText(seasons[0].name, { exact: false }));
      const [, nextButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(nextButton);

      expect(mockRouterService.navigateToSeason).not.toHaveBeenCalled();
    });
  });

  describe('at first season', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SeasonPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[2].id);
      fixture.detectChanges();
    });

    it('does not navigate to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[2].name, { exact: false }));
      const [prevButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(mockRouterService.navigateToSeason).not.toHaveBeenCalled();
    });
  });
});
