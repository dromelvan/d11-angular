import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11TeamSeasonStat, Season, SeasonBase } from '@app/core/api';
import { D11TeamApiService } from '@app/core/api/d11-team/d11-team-api.service';
import { D11TeamSeasonStatApiService } from '@app/core/api/d11-team-season-stat/d11-team-season-stat-api.service';
import { PositionApiService } from '@app/core/api/position/position-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerButtonComponent } from '@app/feature/drawer/season-picker-button/season-picker-button.component';
import { fakeD11TeamBase, fakeD11TeamSeasonStat, fakeSeason } from '@app/test';
import { screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { D11TeamsPageComponent } from './d11-teams-page.component';

describe('D11TeamsPageComponent', () => {
  const mockSeasonApi = { getAll: vi.fn<() => Observable<Season[]>>() };
  const mockD11TeamSeasonStatApi = {
    getD11TeamSeasonStatsBySeasonId: vi.fn<(id: number) => Observable<D11TeamSeasonStat[]>>(),
  };
  const mockD11TeamApi = {
    getPlayerSeasonStatsByD11TeamIdAndSeasonId: vi.fn(),
  };
  const mockPositionApi = { getPositions: vi.fn() };
  const mockRouterService = { navigateToD11Teams: vi.fn(), navigateToPlayer: vi.fn() };

  let seasons: Season[];
  let d11TeamSeasonStats: D11TeamSeasonStat[];
  let fixture: ComponentFixture<D11TeamsPageComponent>;
  let mockCurrentService: {
    season: ReturnType<typeof signal<SeasonBase | undefined>>;
    rxCurrent: { isLoading: ReturnType<typeof signal<boolean>> };
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();

    seasons = [
      { ...fakeSeason(), id: 1, date: '2023-08-01' },
      { ...fakeSeason(), id: 2, date: '2022-08-01' },
      { ...fakeSeason(), id: 3, date: '2021-08-01' },
    ];
    d11TeamSeasonStats = [
      { ...fakeD11TeamSeasonStat(), d11Team: { ...fakeD11TeamBase(), id: 1, name: 'D11Team2' } },
      { ...fakeD11TeamSeasonStat(), d11Team: { ...fakeD11TeamBase(), id: 2, name: 'D11Team1' } },
    ];

    mockSeasonApi.getAll.mockReturnValue(of(seasons));
    mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId.mockReturnValue(
      of(d11TeamSeasonStats),
    );
    mockD11TeamApi.getPlayerSeasonStatsByD11TeamIdAndSeasonId.mockReturnValue(of([]));
    mockPositionApi.getPositions.mockReturnValue(of([]));

    mockCurrentService = {
      season: signal<SeasonBase | undefined>(seasons[0]),
      rxCurrent: { isLoading: signal(false) },
    };

    await TestBed.configureTestingModule({
      imports: [D11TeamsPageComponent],
      providers: [
        { provide: SeasonApiService, useValue: mockSeasonApi },
        { provide: D11TeamSeasonStatApiService, useValue: mockD11TeamSeasonStatApi },
        { provide: D11TeamApiService, useValue: mockD11TeamApi },
        { provide: PositionApiService, useValue: mockPositionApi },
        { provide: RouterService, useValue: mockRouterService },
        { provide: CurrentService, useValue: mockCurrentService },
      ],
    }).compileComponents();
  });

  describe('with seasonId', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(D11TeamsPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[1].id);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders', () => {
      expect(fixture.nativeElement.querySelector('.app-d11-teams-page')).toBeInTheDocument();
    });

    it('calls getAll', () => {
      expect(mockSeasonApi.getAll).toHaveBeenCalled();
    });

    it('renders a scroll picker item for the selected season', () => {
      const button = fixture.nativeElement.querySelector(`[data-id="${seasons[1].id}"]`);
      expect(button).toBeInTheDocument();
    });

    it('calls getPositions', () => {
      expect(mockPositionApi.getPositions).toHaveBeenCalled();
    });

    it('loads stats for the provided season', async () => {
      await waitFor(() => {
        expect(mockD11TeamSeasonStatApi.getD11TeamSeasonStatsBySeasonId).toHaveBeenCalledWith(
          seasons[1].id,
        );
      });
    });

    it('renders a player season stats section for each stat', async () => {
      await waitFor(() => {
        expect(
          fixture.nativeElement.querySelectorAll('app-d11-team-player-season-stats-section').length,
        ).toBe(d11TeamSeasonStats.length);
      });
    });

    it('renders sections sorted alphabetically by d11 team name', async () => {
      await waitFor(() => {
        const headers = Array.from<HTMLElement>(
          fixture.nativeElement.querySelectorAll('[data-testid="section-header"]'),
        );
        expect(headers.length).toBe(2);
        expect(headers[0].textContent?.trim()).toContain('D11Team1');
        expect(headers[1].textContent?.trim()).toContain('D11Team2');
      });
    });

    it('navigates to selected season when a scroll picker item is clicked', async () => {
      await waitFor(() => fixture.nativeElement.querySelector(`[data-id="${seasons[0].id}"]`));
      const button = fixture.nativeElement.querySelector(`[data-id="${seasons[0].id}"]`);
      button.click();

      expect(mockRouterService.navigateToD11Teams).toHaveBeenCalledWith(seasons[0].id);
    });

    it('navigates to selected season when a season picker button selection is made', () => {
      const pickerButton = fixture.debugElement.query(By.directive(SeasonPickerButtonComponent))
        .componentInstance as SeasonPickerButtonComponent;
      pickerButton.seasonSelected.emit(seasons[0]);

      expect(mockRouterService.navigateToD11Teams).toHaveBeenCalledWith(seasons[0].id);
    });
  });

  describe('without seasonId', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(D11TeamsPageComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      TestBed.tick();
    });

    it('calls getAll', () => {
      expect(mockSeasonApi.getAll).toHaveBeenCalled();
    });

    it('does not render the season picker button', () => {
      expect(
        fixture.nativeElement.querySelector('app-season-picker-button'),
      ).not.toBeInTheDocument();
    });

    it('navigates to the current season on auto-select', async () => {
      await waitFor(() => {
        expect(mockRouterService.navigateToD11Teams).toHaveBeenCalledWith(seasons[0].id);
      });
    });
  });

  describe('seasonId input', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(D11TeamsPageComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('is undefined by default', () => {
      expect(fixture.componentInstance.seasonId()).toBeUndefined();
    });

    it('parses a numeric string', () => {
      fixture.componentRef.setInput('seasonId', '42');
      expect(fixture.componentInstance.seasonId()).toBe(42);
    });

    it('parses null as undefined', () => {
      fixture.componentRef.setInput('seasonId', null);
      expect(fixture.componentInstance.seasonId()).toBeUndefined();
    });

    it('parses empty string as undefined', () => {
      fixture.componentRef.setInput('seasonId', '');
      expect(fixture.componentInstance.seasonId()).toBeUndefined();
    });
  });

  describe('live button', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(D11TeamsPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[1].id);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('renders the Live button', () => {
      expect(screen.getByRole('button', { name: 'Live' })).toBeInTheDocument();
    });

    it('navigates to the current season on Live button click', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Live' }));

      expect(mockRouterService.navigateToD11Teams).toHaveBeenCalledWith(seasons[0].id);
    });
  });

  describe('page context', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(D11TeamsPageComponent);
      fixture.componentRef.setInput('seasonId', seasons[1].id);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('sets title to D11 Teams', () => {
      expect(TestBed.inject(PageContextService).title()).toBe('D11 Teams');
    });

    it('sets subtitle to Season <name> for the selected season', () => {
      expect(TestBed.inject(PageContextService).subtitle()).toBe(`Season ${seasons[1].name}`);
    });

    it('falls back to current season name when no season is selected', () => {
      fixture.componentRef.setInput('seasonId', undefined);
      expect(TestBed.inject(PageContextService).subtitle()).toBe(seasons[0].name);
    });
  });
});
