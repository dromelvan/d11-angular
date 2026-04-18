import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11TeamSeasonStat, Position, Season } from '@app/core/api';
import { D11TeamApiService } from '@app/core/api/d11-team/d11-team-api.service';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { PositionApiService } from '@app/core/api/position/position-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakeD11TeamBase, fakeD11TeamSeasonStat, fakePosition, fakeSeason } from '@app/test';
import { screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Observable, of } from 'rxjs';
import { expect, vi } from 'vitest';
import { D11TeamsPageComponent } from './d11-teams-page.component';

describe('D11TeamsPageComponent', () => {
  const mockSeasonApi = { getAll: vi.fn<() => Observable<Season[]>>() };
  const mockD11TeamSeasonStatApi = {
    getD11TeamSeasonStatsBySeasonId: vi.fn<(id: number) => Observable<D11TeamSeasonStat[]>>(),
  };
  const mockPositionApi = { getPositions: vi.fn<() => Observable<Position[]>>() };
  const mockD11TeamApi = { getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn() };
  const mockLoadingService = { register: vi.fn() };
  const mockRouterService = { navigateToD11Teams: vi.fn(), navigateToPlayer: vi.fn() };
  const mockDynamicDialogService = { openPlayerSeasonStat: vi.fn() };

  let seasons: Season[];
  let d11TeamSeasonStats: D11TeamSeasonStat[];
  let fixture: ComponentFixture<D11TeamsPageComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    seasons = [
      { ...fakeSeason(), date: '2023-08-01' },
      { ...fakeSeason(), date: '2022-08-01' },
      { ...fakeSeason(), date: '2021-08-01' },
    ];
    d11TeamSeasonStats = [
      { ...fakeD11TeamSeasonStat(), d11Team: { ...fakeD11TeamBase(), name: 'D11Team2' } },
      { ...fakeD11TeamSeasonStat(), d11Team: { ...fakeD11TeamBase(), name: 'D11Team1' } },
    ];
    mockSeasonApi.getAll.mockReturnValue(of(seasons));
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of(d11TeamSeasonStats),
    );
    mockPositionApi.getPositions.mockReturnValue(of([fakePosition(), fakePosition()]));
    mockD11TeamApi.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [D11TeamsPageComponent],
      providers: [
        { provide: SeasonApiService, useValue: mockSeasonApi },
        { provide: D11TeamSeasonStatApiService, useValue: mockD11TeamSeasonStatApi },
        { provide: PositionApiService, useValue: mockPositionApi },
        { provide: D11TeamApiService, useValue: mockD11TeamApi },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: RouterService, useValue: mockRouterService },
        { provide: DynamicDialogService, useValue: mockDynamicDialogService },
      ],
    }).compileComponents();
  });

  describe('with seasonId', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(D11TeamsPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[1].id);
      fixture.detectChanges();
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(fixture.nativeElement.querySelector('.app-d11-teams-page')).toBeInTheDocument();
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

    it('renders d11-team-squad-card for each stat', async () => {
      await waitFor(() => {
        expect(fixture.nativeElement.querySelectorAll('app-d11-team-squad-card').length).toBe(
          d11TeamSeasonStats.length,
        );
      });
    });

    it('renders d11-team-squad-cards sorted by d11 team name', async () => {
      await waitFor(() => {
        const cards = fixture.nativeElement.querySelectorAll('app-d11-team-squad-card');
        expect(cards.length).toBe(2);
        expect(cards[0].textContent).toContain('D11Team1');
        expect(cards[1].textContent).toContain('D11Team2');
      });
    });

    it('navigates to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[1].name, { exact: false }));
      const [prevButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(mockRouterService.navigateToD11Teams).toHaveBeenCalledExactlyOnceWith(seasons[2].id);
    });

    it('navigates to next season on next button click', async () => {
      await waitFor(() => screen.getByText(seasons[1].name, { exact: false }));
      const [, nextButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(nextButton);

      expect(mockRouterService.navigateToD11Teams).toHaveBeenCalledExactlyOnceWith(seasons[0].id);
    });
  });

  describe('without seasonId', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(D11TeamsPageComponent);
      fixture.detectChanges();
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(fixture.nativeElement.querySelector('.app-d11-teams-page')).toBeInTheDocument();
      });
    });

    it('renders most recent season name', async () => {
      await waitFor(() => {
        expect(screen.getByText(seasons[0].name, { exact: false })).toBeInTheDocument();
      });
    });

    it('navigates to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[0].name, { exact: false }));
      const [prevButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(mockRouterService.navigateToD11Teams).toHaveBeenCalledExactlyOnceWith(seasons[1].id);
    });
  });

  describe('at last season', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(D11TeamsPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[0].id);
      fixture.detectChanges();
    });

    it('does not navigate to next season on next button click', async () => {
      await waitFor(() => screen.getByText(seasons[0].name, { exact: false }));
      const [, nextButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(nextButton);

      expect(mockRouterService.navigateToD11Teams).not.toHaveBeenCalled();
    });
  });

  describe('at first season', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(D11TeamsPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[2].id);
      fixture.detectChanges();
    });

    it('does not navigate to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[2].name, { exact: false }));
      const [prevButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(mockRouterService.navigateToD11Teams).not.toHaveBeenCalled();
    });
  });
});
