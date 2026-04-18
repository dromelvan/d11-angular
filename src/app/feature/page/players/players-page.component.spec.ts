import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerSeasonStatApiService, PlayerSeasonStatPage, Season } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { fakePlayerSeasonStat, fakeSeason } from '@app/test';
import { screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Observable, of } from 'rxjs';
import { expect, vi } from 'vitest';
import { PlayersPageComponent } from './players-page.component';

describe('PlayersPageComponent', () => {
  const mockSeasonApi = { getAll: vi.fn<() => Observable<Season[]>>() };
  const mockPlayerSeasonStatApi = {
    getPlayerSeasonStatsBySeasonId: vi.fn<(id: number) => Observable<PlayerSeasonStatPage>>(),
  };
  const mockLoadingService = { register: vi.fn() };
  const mockRouterService = { navigateToPlayers: vi.fn() };
  const mockDynamicDialogService = { openPlayerSeasonStat: vi.fn() };

  let seasons: Season[];
  let playerSeasonStatPage: PlayerSeasonStatPage;
  let fixture: ComponentFixture<PlayersPageComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    seasons = [
      { ...fakeSeason(), id: 1, date: '2023-08-01' },
      { ...fakeSeason(), id: 2, date: '2022-08-01' },
      { ...fakeSeason(), id: 3, date: '2021-08-01' },
    ];
    playerSeasonStatPage = {
      page: 0,
      totalPages: 1,
      totalElements: 2,
      elements: [fakePlayerSeasonStat(), fakePlayerSeasonStat()],
    };
    mockSeasonApi.getAll.mockReturnValue(of(seasons));
    mockPlayerSeasonStatApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(
      of(playerSeasonStatPage),
    );

    await TestBed.configureTestingModule({
      imports: [PlayersPageComponent],
      providers: [
        { provide: SeasonApiService, useValue: mockSeasonApi },
        { provide: PlayerSeasonStatApiService, useValue: mockPlayerSeasonStatApi },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: RouterService, useValue: mockRouterService },
        { provide: DynamicDialogService, useValue: mockDynamicDialogService },
      ],
    }).compileComponents();
  });

  describe('with seasonId', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PlayersPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[1].id);
      fixture.detectChanges();
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(fixture.nativeElement.querySelector('.app-players-page')).toBeInTheDocument();
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

    it('renders player season stats card', async () => {
      await waitFor(() => {
        expect(
          fixture.nativeElement.querySelector('app-player-season-stats-card'),
        ).toBeInTheDocument();
      });
    });

    it('navigates to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[1].name, { exact: false }));
      const [prevButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(mockRouterService.navigateToPlayers).toHaveBeenCalledExactlyOnceWith(seasons[2].id);
    });

    it('navigates to next season on next button click', async () => {
      await waitFor(() => screen.getByText(seasons[1].name, { exact: false }));
      const [, nextButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(nextButton);

      expect(mockRouterService.navigateToPlayers).toHaveBeenCalledExactlyOnceWith(seasons[0].id);
    });
  });

  describe('without seasonId', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PlayersPageComponent);
      fixture.detectChanges();
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(fixture.nativeElement.querySelector('.app-players-page')).toBeInTheDocument();
      });
    });

    it('gets all seasons', () => {
      expect(mockSeasonApi.getAll).toHaveBeenCalled();
    });

    it('renders most recent season name', async () => {
      await waitFor(() => {
        expect(screen.getByText(seasons[0].name, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders player season stats card', async () => {
      await waitFor(() => {
        expect(
          fixture.nativeElement.querySelector('app-player-season-stats-card'),
        ).toBeInTheDocument();
      });
    });

    it('navigates to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[0].name, { exact: false }));
      const [prevButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(mockRouterService.navigateToPlayers).toHaveBeenCalledExactlyOnceWith(seasons[1].id);
    });
  });

  describe('at last season', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PlayersPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[0].id);
      fixture.detectChanges();
    });

    it('does not navigate to next season on next button click', async () => {
      await waitFor(() => screen.getByText(seasons[0].name, { exact: false }));
      const [, nextButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(nextButton);

      expect(mockRouterService.navigateToPlayers).not.toHaveBeenCalled();
    });
  });

  describe('at first season', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PlayersPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[2].id);
      fixture.detectChanges();
    });

    it('does not navigate to previous season on previous button click', async () => {
      await waitFor(() => screen.getByText(seasons[2].name, { exact: false }));
      const [prevButton] = fixture.nativeElement.querySelectorAll('app-material-icon-button');

      await userEvent.click(prevButton);

      expect(mockRouterService.navigateToPlayers).not.toHaveBeenCalled();
    });
  });
});
