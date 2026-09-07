import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchWeek, MatchWeekBase, SeasonBase } from '@app/core/api';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { CurrentService } from '@app/core/current/current.service';
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
  };

  async function setup(matchWeekId?: number) {
    fixture = TestBed.createComponent(MatchWeekPickerButtonComponent);
    fixture.componentRef.setInput('seasonId', matchWeek.season.id);
    if (matchWeekId !== undefined) fixture.componentRef.setInput('matchWeekId', matchWeekId);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function drawer(): MatchWeekPickerDrawerComponent {
    return fixture.debugElement.query(By.directive(MatchWeekPickerDrawerComponent))
      .componentInstance as MatchWeekPickerDrawerComponent;
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
      ],
    }).compileComponents();

    await setup(matchWeek.id);
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

    drawer().matchWeekSelected.emit(matchWeek.id);

    expect(emitted).toEqual([matchWeek]);
  });

  it('does not emit matchWeekSelected when drawer emits an unknown id', () => {
    const emitted: MatchWeek[] = [];
    fixture.componentInstance.matchWeekSelected.subscribe((mw) => emitted.push(mw));

    drawer().matchWeekSelected.emit(matchWeek.id + 999);

    expect(emitted).toHaveLength(0);
  });

  it('passes matchWeekId as selectedId to the drawer', () => {
    expect(drawer().selectedId()).toBe(matchWeek.id);
  });

  it('passes undefined as selectedId when matchWeekId is not set', async () => {
    await setup();

    expect(drawer().selectedId()).toBeUndefined();
  });

  it('passes current match week id as currentId to the drawer', () => {
    expect(drawer().currentId()).toBe(matchWeek.id);
  });

  it('passes seasons to the drawer', () => {
    expect(drawer().seasons()).toEqual(seasons);
  });

  it('passes current season id to the drawer', () => {
    expect(drawer().currentSeasonId()).toBe(matchWeek.season.id);
  });

  it('passes seasonId as selectedSeasonId to the drawer initially', () => {
    expect(drawer().selectedSeasonId()).toBe(matchWeek.season.id);
  });

  it('returns empty match weeks when loaded season does not match seasonId input', async () => {
    fixture.componentRef.setInput('seasonId', matchWeek.season.id + 1);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(drawer().matchWeeks()).toHaveLength(0);
  });

  it('updates selectedSeasonId when drawer emits seasonSelected', async () => {
    drawer().seasonSelected.emit(seasons[0].id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(drawer().selectedSeasonId()).toBe(seasons[0].id);
  });

  it('emits matchWeekSelected with the last match week when a season is selected', async () => {
    const emitted: MatchWeek[] = [];
    fixture.componentInstance.matchWeekSelected.subscribe((mw) => emitted.push(mw));

    drawer().seasonSelected.emit(matchWeek.season.id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted).toEqual([matchWeek]);
  });

  it('emits the last match week from a list when a season is selected', async () => {
    const matchWeek1 = { ...fakeMatchWeek(), id: 1 };
    const matchWeek2 = { ...fakeMatchWeek(), id: 2 };
    const newSeasonId = matchWeek.season.id + 1;
    const matchWeekApiService = TestBed.inject(MatchWeekApiService);
    vi.mocked(matchWeekApiService.getMatchWeeksBySeasonId).mockReturnValue(
      of([
        { ...matchWeek1, season: { ...matchWeek1.season, id: newSeasonId } },
        { ...matchWeek2, season: { ...matchWeek2.season, id: newSeasonId } },
      ]),
    );

    const emitted: MatchWeek[] = [];
    fixture.componentInstance.matchWeekSelected.subscribe((mw) => emitted.push(mw));

    drawer().seasonSelected.emit(newSeasonId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted[emitted.length - 1].id).toBe(matchWeek2.id);
  });
});
