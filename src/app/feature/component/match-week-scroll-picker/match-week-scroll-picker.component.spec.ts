import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { MatchWeek, MatchWeekBase } from '@app/core/api';
import { MatchWeekApiService } from '@app/core/api/match-week/match-week-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { SafeDatePipe } from '@app/shared/pipes/safe-date.pipe';
import { fakeMatchWeek } from '@app/test';
import { MatchWeekScrollPickerComponent } from './match-week-scroll-picker.component';

describe('MatchWeekScrollPickerComponent', () => {
  let fixture: ComponentFixture<MatchWeekScrollPickerComponent>;
  let matchWeek: MatchWeek;
  let currentMatchWeek: MatchWeek;
  let matchWeekApi: Partial<MatchWeekApiService>;
  let mockCurrentService: {
    matchWeek: ReturnType<typeof signal<MatchWeekBase | undefined>>;
    rxCurrent: { isLoading: ReturnType<typeof signal<boolean>> };
  };

  async function setup(seasonId = matchWeek.season.id, matchWeekId?: number) {
    fixture = TestBed.createComponent(MatchWeekScrollPickerComponent);
    fixture.componentRef.setInput('seasonId', seasonId);
    if (matchWeekId !== undefined) fixture.componentRef.setInput('matchWeekId', matchWeekId);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();

    matchWeek = fakeMatchWeek();
    currentMatchWeek = fakeMatchWeek();

    matchWeekApi = {
      getMatchWeeksBySeasonId: vi.fn().mockReturnValue(of([matchWeek, currentMatchWeek])),
    };

    mockCurrentService = {
      matchWeek: signal<MatchWeekBase | undefined>(currentMatchWeek),
      rxCurrent: { isLoading: signal(false) },
    };

    await TestBed.configureTestingModule({
      imports: [MatchWeekScrollPickerComponent],
      providers: [
        { provide: MatchWeekApiService, useValue: matchWeekApi },
        { provide: CurrentService, useValue: mockCurrentService },
        { provide: LoadingService, useValue: { register: vi.fn() } },
      ],
    }).compileComponents();

    await setup();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calls getMatchWeeksBySeasonId with the season id', () => {
    expect(matchWeekApi.getMatchWeeksBySeasonId).toHaveBeenCalledWith(matchWeek.season.id);
  });

  it('calls getMatchWeeksBySeasonId again when seasonId input changes', async () => {
    const newSeasonId = matchWeek.season.id + 1;

    fixture.componentRef.setInput('seasonId', newSeasonId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(matchWeekApi.getMatchWeeksBySeasonId).toHaveBeenCalledWith(newSeasonId);
  });

  it('renders a scroll picker item for each match week', () => {
    const button = fixture.nativeElement.querySelector(`[data-id="${matchWeek.id}"]`);
    expect(button).not.toBeNull();
  });

  it('renders the match week number label in the scroll picker', () => {
    expect(fixture.nativeElement.textContent).toContain(`W ${matchWeek.matchWeekNumber}`);
  });

  it('renders the match week date in the scroll picker', () => {
    const expected = new SafeDatePipe().transform(matchWeek.date, 'd MMM');
    expect(fixture.nativeElement.textContent).toContain(expected);
  });

  it('does not render the scroll picker when there are no match weeks', async () => {
    (matchWeekApi.getMatchWeeksBySeasonId as ReturnType<typeof vi.fn>).mockReturnValue(of([]));

    fixture.componentRef.setInput('seasonId', matchWeek.season.id + 1);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-scroll-picker')).toBeNull();
  });

  it('emits the full match week when a scroll picker item is clicked', () => {
    const emitted: MatchWeek[] = [];
    fixture.componentInstance.matchWeekSelected.subscribe((emittedMatchWeek) =>
      emitted.push(emittedMatchWeek),
    );

    const button = fixture.nativeElement.querySelector(`[data-id="${matchWeek.id}"]`);
    button.click();

    expect(emitted).toEqual([matchWeek]);
  });

  it('applies primary background to the current match week button', () => {
    const button = fixture.nativeElement.querySelector(`[data-id="${currentMatchWeek.id}"]`);
    expect(button.classList).toContain('bg-primary');
    expect(button.classList).toContain('text-primary-contrast');
  });

  it('defaults to the current match week as selected when matchWeekId is not provided', () => {
    const otherButton = fixture.nativeElement.querySelector(`[data-id="${matchWeek.id}"]`);
    expect(otherButton.classList).not.toContain('bg-surface-300');
  });

  it('defaults to the first match week when the current match week is not in the season', async () => {
    const outsideMatchWeek = { ...fakeMatchWeek(), id: 99999 };
    mockCurrentService.matchWeek.set(outsideMatchWeek);

    fixture = TestBed.createComponent(MatchWeekScrollPickerComponent);
    fixture.componentInstance.matchWeekSelected.subscribe(() => {});
    fixture.componentRef.setInput('seasonId', matchWeek.season.id);
    fixture.detectChanges();
    await fixture.whenStable();

    const firstButton = fixture.nativeElement.querySelector(`[data-id="${matchWeek.id}"]`);
    expect(firstButton.classList).toContain('bg-surface-300');
  });

  it('uses CurrentService matchWeek to mark the current match week', () => {
    const currentButton = fixture.nativeElement.querySelector(`[data-id="${currentMatchWeek.id}"]`);
    expect(currentButton.classList).toContain('bg-primary');
  });

  it('emits the current match week on initial load', async () => {
    const emitted: MatchWeek[] = [];

    fixture = TestBed.createComponent(MatchWeekScrollPickerComponent);
    fixture.componentInstance.matchWeekSelected.subscribe((mw) => emitted.push(mw));
    fixture.componentRef.setInput('seasonId', matchWeek.season.id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted).toEqual([currentMatchWeek]);
  });

  it('re-emits the default match week when seasonId changes', async () => {
    const newSeasonId = matchWeek.season.id + 1;
    const newMatchWeek = { ...fakeMatchWeek(), season: { ...matchWeek.season, id: newSeasonId } };
    const currentMatchWeekInNewSeason = {
      ...currentMatchWeek,
      season: { ...currentMatchWeek.season, id: newSeasonId },
    };
    (matchWeekApi.getMatchWeeksBySeasonId as ReturnType<typeof vi.fn>).mockReturnValue(
      of([newMatchWeek, currentMatchWeekInNewSeason]),
    );

    const emitted: MatchWeek[] = [];
    fixture.componentInstance.matchWeekSelected.subscribe((mw) => emitted.push(mw));

    fixture.componentRef.setInput('seasonId', newSeasonId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted.length).toBe(1);
    expect(emitted[0].id).toBe(currentMatchWeek.id);
  });

  it('does not emit when loaded match weeks belong to a different season', async () => {
    const emitted: MatchWeek[] = [];
    fixture.componentInstance.matchWeekSelected.subscribe((mw) => emitted.push(mw));

    fixture.componentRef.setInput('seasonId', matchWeek.season.id + 99);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted).toEqual([]);
  });

  it('does not use matchWeekId when it does not belong to the current season', async () => {
    const newSeasonId = matchWeek.season.id + 1;
    const newMatchWeek = { ...fakeMatchWeek(), season: { ...matchWeek.season, id: newSeasonId } };
    const currentMatchWeekInNewSeason = {
      ...currentMatchWeek,
      season: { ...currentMatchWeek.season, id: newSeasonId },
    };
    (matchWeekApi.getMatchWeeksBySeasonId as ReturnType<typeof vi.fn>).mockReturnValue(
      of([newMatchWeek, currentMatchWeekInNewSeason]),
    );

    const emitted: MatchWeek[] = [];
    fixture.componentInstance.matchWeekSelected.subscribe((mw) => emitted.push(mw));

    fixture.componentRef.setInput('matchWeekId', matchWeek.id);
    fixture.componentRef.setInput('seasonId', newSeasonId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted.length).toBe(1);
    expect(emitted[0].id).toBe(currentMatchWeek.id);
  });
});
