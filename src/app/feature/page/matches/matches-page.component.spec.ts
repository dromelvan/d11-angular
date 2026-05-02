import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { screen } from '@testing-library/angular';
import { beforeEach, describe, expect, vi } from 'vitest';
import { MatchWeek, SeasonBase } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { MatchApiService } from '@app/core/api/match/match-api.service';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
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

  beforeEach(async () => {
    vi.clearAllMocks();

    mockRouterService = {
      navigateToMatch: vi.fn(),
      navigateToMatchWeekMatches: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MatchesPageComponent],
      providers: [
        { provide: SeasonApiService, useValue: { getAll: vi.fn().mockReturnValue(of([])) } },
        { provide: LoadingService, useValue: { register: vi.fn() } },
        {
          provide: MatchWeekApiService,
          useValue: { getMatchWeeksBySeasonId: vi.fn().mockReturnValue(of([])) },
        },
        {
          provide: CurrentService,
          useValue: {
            season: signal(undefined),
            matchWeek: signal(undefined),
            rxCurrent: { isLoading: signal(false) },
          },
        },
        {
          provide: MatchApiService,
          useValue: {
            getMatchesByMatchWeekId: vi.fn().mockReturnValue(of([])),
            getActiveMatches: vi.fn().mockReturnValue(of([])),
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

  it('renders season picker', () => {
    expect(fixture.nativeElement.querySelector('app-season-picker')).toBeTruthy();
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
  });

  describe('Live button', () => {
    it('click shows match week matches', () => {
      screen.getByText('Live').click();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-match-week-matches')).toBeTruthy();
    });

    it('second click hides match week matches', () => {
      screen.getByText('Live').click();
      fixture.detectChanges();
      screen.getByText('Live').click();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-match-week-matches')).toBeNull();
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

    it('sets active to false', () => {
      screen.getByText('Live').click();
      fixture.detectChanges();

      (component as unknown as MatchesPageInternal).onMatchWeekSelected(fakeMatchWeek());
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-match-week-matches')).toBeNull();
    });
  });
});
