import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { screen } from '@testing-library/angular';
import { beforeEach, describe, expect, vi } from 'vitest';
import { MatchWeek, MatchWeekBase, SeasonBase } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatchWeek, fakeSeasonBase } from '@app/test';
import { MatchesPageComponent } from './matches-page.component';

interface MatchesPageInternal {
  onSeasonSelected: (season: SeasonBase) => void;
  onMatchWeekSelected: (matchWeek: MatchWeek) => void;
}

describe('MatchesPageComponent', () => {
  let fixture: ComponentFixture<MatchesPageComponent>;
  let component: MatchesPageComponent;
  let mockRouterService: {
    navigateToMatch: ReturnType<typeof vi.fn>;
    navigateToMatchWeekMatches: ReturnType<typeof vi.fn>;
  };
  let mockCurrentService: {
    season: ReturnType<typeof signal<SeasonBase | undefined>>;
    matchWeek: ReturnType<typeof signal<MatchWeekBase | undefined>>;
    rxCurrent: { isLoading: ReturnType<typeof signal<boolean>> };
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockRouterService = {
      navigateToMatch: vi.fn(),
      navigateToMatchWeekMatches: vi.fn(),
    };

    mockCurrentService = {
      season: signal<SeasonBase | undefined>(undefined),
      matchWeek: signal<MatchWeekBase | undefined>(undefined),
      rxCurrent: { isLoading: signal(false) },
    };

    await TestBed.configureTestingModule({
      imports: [MatchesPageComponent],
      providers: [
        { provide: SeasonApiService, useValue: { getAll: vi.fn().mockReturnValue(of([])) } },
        {
          provide: MatchWeekApiService,
          useValue: {
            getById: vi.fn().mockReturnValue(of(undefined)),
            getMatchWeeksBySeasonId: vi.fn().mockReturnValue(of([])),
          },
        },
        { provide: CurrentService, useValue: mockCurrentService },
        {
          provide: MatchApiService,
          useValue: {
            getMatchesByMatchWeekId: vi.fn().mockReturnValue(of([])),
            getActiveMatches: vi.fn().mockReturnValue(of([])),
          },
        },
        {
          provide: D11MatchApiService,
          useValue: {
            getD11MatchesByMatchWeekId: vi.fn().mockReturnValue(of([])),
            getActiveD11Matches: vi.fn().mockReturnValue(of([])),
          },
        },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders Live button', () => {
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  describe('matchWeekId input', () => {
    it('is undefined by default', () => {
      expect(component.matchWeekId()).toBeUndefined();
    });

    it('parses a numeric string', () => {
      fixture.componentRef.setInput('matchWeekId', '42');
      expect(component.matchWeekId()).toBe(42);
    });

    it('shows match week sections when matchWeekId is set and Live is not active', async () => {
      fixture.componentRef.setInput('matchWeekId', 1);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('app-match-week-matches-section')).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('app-match-week-d11-matches-section'),
      ).toBeTruthy();
    });

    it('shows season pickers when match week loads', async () => {
      const matchWeekApiService = TestBed.inject(MatchWeekApiService);
      vi.mocked(matchWeekApiService.getById).mockReturnValue(of(fakeMatchWeek()));

      fixture.componentRef.setInput('matchWeekId', 1);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('app-match-week-scroll-picker')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('app-match-week-picker-button')).toBeTruthy();
    });

    it('does not show match week sections when matchWeekId is undefined and Live is not active', () => {
      expect(fixture.nativeElement.querySelector('app-match-week-matches-section')).toBeNull();
    });
  });

  describe('currentService.season fallback', () => {
    it('shows season pickers when currentService.season is set and matchWeekId is not provided', async () => {
      mockCurrentService.season.set(fakeSeasonBase());
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelector('app-match-week-scroll-picker')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('app-match-week-picker-button')).toBeTruthy();
    });
  });

  describe('Live button', () => {
    it('click shows match week sections', () => {
      screen.getByText('Live').click();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-match-week-matches-section')).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector('app-match-week-d11-matches-section'),
      ).toBeTruthy();
    });

    it('second click hides match week sections', () => {
      screen.getByText('Live').click();
      fixture.detectChanges();
      screen.getByText('Live').click();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-match-week-matches-section')).toBeNull();
    });

    it('applies bg-primary-300 when active', () => {
      const liveButton = screen.getByText('Live');

      liveButton.click();
      fixture.detectChanges();
      expect(liveButton.classList).toContain('bg-primary-300');

      liveButton.click();
      fixture.detectChanges();
      expect(liveButton.classList).not.toContain('bg-primary-300');
    });
  });

  describe('onSeasonSelected', () => {
    it('shows match week scroll picker', () => {
      (component as unknown as MatchesPageInternal).onSeasonSelected(fakeSeasonBase());
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-match-week-scroll-picker')).toBeTruthy();
    });

    it('shows match week picker button', () => {
      (component as unknown as MatchesPageInternal).onSeasonSelected(fakeSeasonBase());
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-match-week-picker-button')).toBeTruthy();
    });
  });

  describe('onMatchWeekSelected', () => {
    it('navigates to match week matches', () => {
      const matchWeek = fakeMatchWeek();
      (component as unknown as MatchesPageInternal).onMatchWeekSelected(matchWeek);

      expect(mockRouterService.navigateToMatchWeekMatches).toHaveBeenCalledExactlyOnceWith(
        matchWeek.id,
      );
    });

    it('shows season pickers after match week selected', () => {
      (component as unknown as MatchesPageInternal).onMatchWeekSelected(fakeMatchWeek());
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-match-week-scroll-picker')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('app-match-week-picker-button')).toBeTruthy();
    });

    it('sets active to false', () => {
      screen.getByText('Live').click();
      fixture.detectChanges();

      (component as unknown as MatchesPageInternal).onMatchWeekSelected(fakeMatchWeek());
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-match-week-matches-section')).toBeNull();
    });
  });
});
