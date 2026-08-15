import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonBase } from '@app/core/api';
import { fakeSeasonBase } from '@app/test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SeasonPickerDrawerComponent } from './season-picker-drawer.component';

describe('SeasonPickerDrawerComponent', () => {
  let component: SeasonPickerDrawerComponent;
  let fixture: ComponentFixture<SeasonPickerDrawerComponent>;
  let seasons: SeasonBase[];

  function getSeasonButton(shortName: string): HTMLButtonElement | undefined {
    return Array.from(document.body.querySelectorAll<HTMLButtonElement>('button')).find((btn) =>
      btn.textContent?.includes(shortName),
    );
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    seasons = [
      { ...fakeSeasonBase(), id: 1, shortName: '23-24' },
      { ...fakeSeasonBase(), id: 2, shortName: '24-25' },
    ];

    await TestBed.configureTestingModule({
      imports: [SeasonPickerDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonPickerDrawerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('seasons', seasons);
    fixture.componentRef.setInput('selectedSeasonId', seasons[0].id);
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

  it('should emit seasonSelected and close on season change', () => {
    component.open();
    const emitted: number[] = [];
    component.seasonSelected.subscribe((id) => emitted.push(id));

    component['onSeasonChange'](seasons[0].id);

    expect(emitted).toEqual([seasons[0].id]);
    expect(component['visible']()).toBe(false);
  });

  it('should render a button for each season', async () => {
    component.open();
    fixture.detectChanges();
    await fixture.whenStable();

    const buttons = seasons.map((season) => getSeasonButton(season.shortName));
    expect(buttons.every(Boolean)).toBe(true);
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
