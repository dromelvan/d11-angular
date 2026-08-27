import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchWeek, MatchWeekBase, SeasonBase } from '@app/core/api';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { fakeMatchWeek, fakeSeasonBase } from '@app/test';
import { MatchWeekPickerDrawerComponent } from '@app/feature/drawer/match-week-picker-drawer/match-week-picker-drawer.component';
import { MatchWeekPickerButtonComponent } from './match-week-picker-button.component';

describe('MatchWeekPickerButtonComponent', () => {
  let fixture: ComponentFixture<MatchWeekPickerButtonComponent>;
  let matchWeek: MatchWeek;
  let seasons: SeasonBase[];
  let mockCurrentService: {
    matchWeek: ReturnType<typeof signal<MatchWeekBase | undefined>>;
    season: ReturnType<typeof signal<SeasonBase | undefined>>;
    rxCurrent: { isLoading: ReturnType<typeof signal<boolean>> };
  };

  async function setup() {
    fixture = TestBed.createComponent(MatchWeekPickerButtonComponent);
    fixture.componentRef.setInput('seasonId', matchWeek.season.id);
    fixture.componentRef.setInput('matchWeekId', matchWeek.id);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    matchWeek = fakeMatchWeek();

    seasons = [
      { ...fakeSeasonBase(), id: 1, shortName: '23-24' },
      { ...fakeSeasonBase(), id: 2, shortName: '24-25' },
    ];

    mockCurrentService = {
      matchWeek: signal<MatchWeekBase | undefined>(matchWeek),
      season: signal<SeasonBase | undefined>(matchWeek.season),
      rxCurrent: { isLoading: signal(false) },
    };

    await TestBed.configureTestingModule({
      imports: [MatchWeekPickerButtonComponent],
      providers: [
        {
          provide: MatchWeekApiService,
          useValue: { getMatchWeeksBySeasonId: vi.fn().mockReturnValue(of([matchWeek])) },
        },
        {
          provide: SeasonApiService,
          useValue: { getAll: vi.fn().mockReturnValue(of(seasons)) },
        },
        { provide: CurrentService, useValue: mockCurrentService },
        { provide: LoadingService, useValue: { register: vi.fn() } },
      ],
    }).compileComponents();

    await setup();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a more button', () => {
    expect(fixture.nativeElement.querySelector('button')).toBeInTheDocument();
  });

  it('opens the drawer on more button click', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.fixed.inset-0')).toBeInTheDocument();
  });

  it('emits matchWeekSelected with the full match week when the drawer emits a selection', () => {
    const emitted: MatchWeek[] = [];
    fixture.componentInstance.matchWeekSelected.subscribe((mw) => emitted.push(mw));

    const drawer = fixture.debugElement.query(By.directive(MatchWeekPickerDrawerComponent))
      .componentInstance as MatchWeekPickerDrawerComponent;
    drawer.matchWeekSelected.emit(matchWeek.id);

    expect(emitted).toEqual([matchWeek]);
  });

  it('does not emit matchWeekSelected when drawer emits an unknown id', () => {
    const emitted: MatchWeek[] = [];
    fixture.componentInstance.matchWeekSelected.subscribe((mw) => emitted.push(mw));

    const drawer = fixture.debugElement.query(By.directive(MatchWeekPickerDrawerComponent))
      .componentInstance as MatchWeekPickerDrawerComponent;
    drawer.matchWeekSelected.emit(matchWeek.id + 999);

    expect(emitted).toHaveLength(0);
  });

  it('passes current match week id as currentId to the drawer', () => {
    const drawer = fixture.debugElement.query(By.directive(MatchWeekPickerDrawerComponent))
      .componentInstance as MatchWeekPickerDrawerComponent;

    expect(drawer.currentId()).toBe(matchWeek.id);
  });

  it('returns empty match weeks when loaded season does not match seasonId input', async () => {
    const differentSeasonId = matchWeek.season.id + 1;
    fixture.componentRef.setInput('seasonId', differentSeasonId);
    fixture.detectChanges();
    await fixture.whenStable();

    const drawer = fixture.debugElement.query(By.directive(MatchWeekPickerDrawerComponent))
      .componentInstance as MatchWeekPickerDrawerComponent;
    expect(drawer.matchWeeks()).toHaveLength(0);
  });

  it('passes seasons to the drawer', () => {
    const drawer = fixture.debugElement.query(By.directive(MatchWeekPickerDrawerComponent))
      .componentInstance as MatchWeekPickerDrawerComponent;

    expect(drawer.seasons()).toEqual(seasons);
  });

  it('passes current season id to the drawer', () => {
    const drawer = fixture.debugElement.query(By.directive(MatchWeekPickerDrawerComponent))
      .componentInstance as MatchWeekPickerDrawerComponent;

    expect(drawer.currentSeasonId()).toBe(matchWeek.season.id);
  });

  it('passes seasonId as selectedSeasonId to the drawer initially', () => {
    const drawer = fixture.debugElement.query(By.directive(MatchWeekPickerDrawerComponent))
      .componentInstance as MatchWeekPickerDrawerComponent;

    expect(drawer.selectedSeasonId()).toBe(matchWeek.season.id);
  });

  it('updates selectedSeasonId when drawer emits seasonSelected', async () => {
    const drawer = fixture.debugElement.query(By.directive(MatchWeekPickerDrawerComponent))
      .componentInstance as MatchWeekPickerDrawerComponent;

    drawer.seasonSelected.emit(seasons[0].id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(drawer.selectedSeasonId()).toBe(seasons[0].id);
  });

  it('emits matchWeekSelected with the last match week when a season is selected', async () => {
    const emitted: MatchWeek[] = [];
    fixture.componentInstance.matchWeekSelected.subscribe((mw) => emitted.push(mw));

    const drawer = fixture.debugElement.query(By.directive(MatchWeekPickerDrawerComponent))
      .componentInstance as MatchWeekPickerDrawerComponent;
    drawer.seasonSelected.emit(matchWeek.season.id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted).toEqual([matchWeek]);
  });
});
