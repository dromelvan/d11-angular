import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NEVER, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Season } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { PlayerSeasonStatApiService } from '@app/core/api/player-season-stat/player-season-stat-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { SeasonPickerButtonComponent } from '@app/feature/drawer/season-picker-button/season-picker-button.component';
import { SeasonScrollPickerComponent } from '@app/feature/scroll-picker/season-scroll-picker/season-scroll-picker.component';
import { fakeSeason } from '@app/test';
import { PlayersPageComponent } from './players-page.component';

const currentSeason = signal<Season | undefined>(undefined);

const mockSeasonApi = { getAll: vi.fn() };
const mockPlayerSeasonStatApi = { getPlayerSeasonStatsBySeasonId: vi.fn() };
const mockCurrentService = { season: currentSeason, rxCurrent: { isLoading: signal(false) } };
const mockRouterService = { navigateToPlayers: vi.fn() };
const mockPageContextService = { setContext: vi.fn() };

const providers = [
  provideHttpClient(),
  provideHttpClientTesting(),
  provideRouter([]),
  { provide: SeasonApiService, useValue: mockSeasonApi },
  { provide: PlayerSeasonStatApiService, useValue: mockPlayerSeasonStatApi },
  { provide: CurrentService, useValue: mockCurrentService },
  { provide: RouterService, useValue: mockRouterService },
  { provide: PageContextService, useValue: mockPageContextService },
];

const seasons = [
  { ...fakeSeason(), id: 1, date: '2023-08-01' },
  { ...fakeSeason(), id: 2, date: '2022-08-01' },
];

const emptyStatPage = { page: 0, totalPages: 1, totalElements: 0, elements: [] };

const selectSeason = (fixture: ComponentFixture<PlayersPageComponent>, season: Season): void => {
  fixture.debugElement
    .query(By.directive(SeasonScrollPickerComponent))
    .componentInstance.seasonSelected.emit(season);
  TestBed.tick();
};

describe('PlayersPageComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();
    currentSeason.set(undefined);
    mockSeasonApi.getAll.mockReturnValue(of(seasons));
    mockPlayerSeasonStatApi.getPlayerSeasonStatsBySeasonId.mockReturnValue(of(emptyStatPage));
  });

  describe('renders', () => {
    it('renders the Live button', async () => {
      await render(PlayersPageComponent, { providers });
      TestBed.tick();

      expect(screen.getByRole('button', { name: 'Live' })).toBeInTheDocument();
    });

    it('renders the stats section when seasonId input is set', async () => {
      const { container } = await render(PlayersPageComponent, {
        inputs: { seasonId: seasons[0].id },
        providers,
      });
      TestBed.tick();

      expect(container.querySelector('app-player-season-stats-section')).toBeInTheDocument();
    });

    it('does not render the stats section before a season is selected', async () => {
      mockSeasonApi.getAll.mockReturnValue(NEVER);
      const { container } = await render(PlayersPageComponent, { providers });
      TestBed.tick();

      expect(container.querySelector('app-player-season-stats-section')).not.toBeInTheDocument();
    });
  });

  describe('Live button', () => {
    it('navigates to the current season when clicked', async () => {
      currentSeason.set(seasons[0]);
      await render(PlayersPageComponent, { providers });
      TestBed.tick();

      await userEvent.click(screen.getByRole('button', { name: 'Live' }));

      expect(mockRouterService.navigateToPlayers).toHaveBeenCalledWith(seasons[0].id);
    });

    it('does nothing when there is no current season', async () => {
      await render(PlayersPageComponent, { providers });
      TestBed.tick();

      await userEvent.click(screen.getByRole('button', { name: 'Live' }));

      expect(mockRouterService.navigateToPlayers).not.toHaveBeenCalled();
    });
  });

  describe('seasonId input', () => {
    it('is undefined by default', async () => {
      const { fixture } = await render(PlayersPageComponent, { providers });
      TestBed.tick();

      expect(fixture.componentInstance.seasonId()).toBeUndefined();
    });

    it('parses a numeric string', async () => {
      const { fixture } = await render(PlayersPageComponent, { providers });
      TestBed.tick();

      fixture.componentRef.setInput('seasonId', '42');

      expect(fixture.componentInstance.seasonId()).toBe(42);
    });

    it('parses null as undefined', async () => {
      const { fixture } = await render(PlayersPageComponent, { providers });
      TestBed.tick();

      fixture.componentRef.setInput('seasonId', null);

      expect(fixture.componentInstance.seasonId()).toBeUndefined();
    });

    it('parses empty string as undefined', async () => {
      const { fixture } = await render(PlayersPageComponent, { providers });
      TestBed.tick();

      fixture.componentRef.setInput('seasonId', '');

      expect(fixture.componentInstance.seasonId()).toBeUndefined();
    });
  });

  describe('season selection', () => {
    beforeEach(() => {
      mockSeasonApi.getAll.mockReturnValue(NEVER);
    });

    it('does not navigate on first selection', async () => {
      const { fixture } = await render(PlayersPageComponent, { providers });
      TestBed.tick();

      selectSeason(fixture, seasons[0]);

      expect(mockRouterService.navigateToPlayers).not.toHaveBeenCalled();
    });

    it('navigates on subsequent selection', async () => {
      const { fixture } = await render(PlayersPageComponent, { providers });
      TestBed.tick();

      selectSeason(fixture, seasons[0]);
      selectSeason(fixture, seasons[1]);

      expect(mockRouterService.navigateToPlayers).toHaveBeenCalledWith(seasons[1].id);
    });

    it('navigates when seasonId input is already set', async () => {
      const { fixture } = await render(PlayersPageComponent, {
        inputs: { seasonId: seasons[0].id },
        providers,
      });
      TestBed.tick();

      selectSeason(fixture, seasons[1]);

      expect(mockRouterService.navigateToPlayers).toHaveBeenCalledWith(seasons[1].id);
    });

    it('renders the stats section after season is selected', async () => {
      const { fixture, container } = await render(PlayersPageComponent, { providers });
      TestBed.tick();

      selectSeason(fixture, seasons[0]);

      expect(container.querySelector('app-player-season-stats-section')).toBeInTheDocument();
    });

    it('navigates to selected season when a season picker button selection is made', async () => {
      const { fixture } = await render(PlayersPageComponent, {
        inputs: { seasonId: seasons[0].id },
        providers,
      });
      TestBed.tick();

      fixture.debugElement
        .query(By.directive(SeasonPickerButtonComponent))
        .componentInstance.seasonSelected.emit(seasons[1]);

      expect(mockRouterService.navigateToPlayers).toHaveBeenCalledWith(seasons[1].id);
    });
  });

  describe('page context', () => {
    it('sets title Player Stats', async () => {
      await render(PlayersPageComponent, { providers });
      TestBed.tick();

      const context = mockPageContextService.setContext.mock.calls[0][0];
      expect(context.title()).toBe('Player Stats');
    });

    it('sets subtitle to Season name after season is selected', async () => {
      mockSeasonApi.getAll.mockReturnValue(NEVER);
      const { fixture } = await render(PlayersPageComponent, { providers });
      TestBed.tick();

      selectSeason(fixture, seasons[0]);

      const context = mockPageContextService.setContext.mock.calls[0][0];
      expect(context.subtitle()).toBe(`Season ${seasons[0].name}`);
    });

    it('has no subtitle before a season is selected', async () => {
      mockSeasonApi.getAll.mockReturnValue(NEVER);
      await render(PlayersPageComponent, { providers });
      TestBed.tick();

      const context = mockPageContextService.setContext.mock.calls[0][0];
      expect(context.subtitle()).toBeUndefined();
    });
  });
});
