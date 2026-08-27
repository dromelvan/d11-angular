import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchWeek, SeasonBase, Status } from '@app/core/api';
import { fakeMatchWeek, fakeSeasonBase } from '@app/test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchWeekPickerDrawerComponent } from './match-week-picker-drawer.component';

describe('MatchWeekPickerDrawerComponent', () => {
  let component: MatchWeekPickerDrawerComponent;
  let fixture: ComponentFixture<MatchWeekPickerDrawerComponent>;
  let matchWeeks: MatchWeek[];
  let seasons: SeasonBase[];

  function getButtons(): HTMLButtonElement[] {
    return Array.from(document.body.querySelectorAll('button'));
  }

  function getMatchWeekButtons(): HTMLButtonElement[] {
    return getButtons().filter((btn) => !btn.textContent?.includes('Season'));
  }

  function getSeasonButton(shortName: string): HTMLButtonElement | undefined {
    return getButtons().find((btn) => btn.textContent?.includes(shortName));
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    matchWeeks = [
      { ...fakeMatchWeek(), id: 1, matchWeekNumber: 1, status: Status.FINISHED },
      { ...fakeMatchWeek(), id: 2, matchWeekNumber: 2, status: Status.FINISHED },
    ];

    seasons = [
      { ...fakeSeasonBase(), id: 1, shortName: '23-24' },
      { ...fakeSeasonBase(), id: 2, shortName: '24-25' },
    ];

    await TestBed.configureTestingModule({
      imports: [MatchWeekPickerDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchWeekPickerDrawerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('matchWeeks', matchWeeks);
    fixture.componentRef.setInput('selectedId', matchWeeks[0].id);
    fixture.componentRef.setInput('seasons', seasons);
    fixture.componentRef.setInput('selectedSeasonId', seasons[1].id);
    fixture.componentRef.setInput('currentSeasonId', seasons[1].id);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with drawer closed', () => {
    expect(component['visible']()).toBe(false);
  });

  it('should open on open()', () => {
    component.open();
    expect(component['visible']()).toBe(true);
  });

  it('should close on close()', () => {
    component.open();
    component['close']();
    expect(component['visible']()).toBe(false);
  });

  it('should emit matchWeekSelected and close on match week change', () => {
    component.open();
    const emitted: number[] = [];
    component.matchWeekSelected.subscribe((id) => emitted.push(id));

    component['onMatchWeekChange'](matchWeeks[1].id);

    expect(emitted).toEqual([matchWeeks[1].id]);
    expect(component['visible']()).toBe(false);
  });

  it('should apply bg-primary to currentId button', async () => {
    component.open();
    fixture.componentRef.setInput('currentId', matchWeeks[1].id);
    fixture.detectChanges();
    await fixture.whenStable();

    const matchWeekButtons = getMatchWeekButtons();
    expect(matchWeekButtons[1].classList).toContain('bg-primary');
    expect(matchWeekButtons[0].classList).not.toContain('bg-primary');
  });

  it('should show in progress indicator for ACTIVE and FULL_TIME status', async () => {
    component.open();
    fixture.componentRef.setInput('matchWeeks', [
      { ...fakeMatchWeek(), id: 1, matchWeekNumber: 1, status: Status.PENDING },
      { ...fakeMatchWeek(), id: 2, matchWeekNumber: 2, status: Status.ACTIVE },
      { ...fakeMatchWeek(), id: 3, matchWeekNumber: 3, status: Status.FULL_TIME },
      { ...fakeMatchWeek(), id: 4, matchWeekNumber: 4, status: Status.FINISHED },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const indicators = document.body.querySelectorAll('.text-error');
    expect(indicators.length).toBe(2);
  });

  it('should render a button for each season', async () => {
    component.open();
    fixture.detectChanges();
    await fixture.whenStable();

    const seasonButtons = seasons.map((season) => getSeasonButton(season.shortName));
    expect(seasonButtons.every(Boolean)).toBe(true);
  });

  it('should emit seasonSelected and close on season change', () => {
    component.open();
    const emitted: number[] = [];
    component.seasonSelected.subscribe((id) => emitted.push(id));

    component['onSeasonChange'](seasons[0].id);

    expect(emitted).toEqual([seasons[0].id]);
    expect(component['visible']()).toBe(false);
  });

  it('should apply bg-surface-300 to selected season button when not current', async () => {
    component.open();
    fixture.componentRef.setInput('selectedSeasonId', seasons[0].id);
    fixture.componentRef.setInput('currentSeasonId', seasons[1].id);
    fixture.detectChanges();
    await fixture.whenStable();

    const season1Button = getSeasonButton(seasons[0].shortName);
    expect(season1Button?.classList).toContain('bg-surface-300');
    expect(season1Button?.classList).not.toContain('bg-primary');
  });

  it('should apply bg-primary to current season button', async () => {
    component.open();
    fixture.componentRef.setInput('currentSeasonId', seasons[1].id);
    fixture.detectChanges();
    await fixture.whenStable();

    const season2Button = getSeasonButton(seasons[1].shortName);
    expect(season2Button?.classList).toContain('bg-primary');
    expect(season2Button?.classList).toContain('text-primary-contrast');
    expect(season2Button?.classList).not.toContain('bg-surface-300');
  });
});
