import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeasonBase, Status, TransferWindow } from '@app/core/api';
import { fakeSeasonBase, fakeTransferWindow } from '@app/test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TransferWindowPickerDrawerComponent } from './transfer-window-picker-drawer.component';

describe('TransferWindowPickerDrawerComponent', () => {
  let component: TransferWindowPickerDrawerComponent;
  let fixture: ComponentFixture<TransferWindowPickerDrawerComponent>;
  let transferWindows: TransferWindow[];
  let seasons: SeasonBase[];

  function getButtons(): HTMLButtonElement[] {
    return Array.from(document.body.querySelectorAll('button'));
  }

  function getTransferWindowButtons(): HTMLButtonElement[] {
    return getButtons().filter((btn) => !btn.textContent?.includes('Season'));
  }

  function getSeasonButton(shortName: string): HTMLButtonElement | undefined {
    return getButtons().find((btn) => btn.textContent?.includes(shortName));
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    transferWindows = [
      { ...fakeTransferWindow(), id: 1, transferWindowNumber: 1, status: Status.FINISHED },
      { ...fakeTransferWindow(), id: 2, transferWindowNumber: 2, status: Status.FINISHED },
    ];

    seasons = [
      { ...fakeSeasonBase(), id: 1, shortName: '23-24' },
      { ...fakeSeasonBase(), id: 2, shortName: '24-25' },
    ];

    await TestBed.configureTestingModule({
      imports: [TransferWindowPickerDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferWindowPickerDrawerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('transferWindows', transferWindows);
    fixture.componentRef.setInput('selectedId', transferWindows[0].id);
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

  it('should emit transferWindowSelected and close on transfer window change', () => {
    component.open();
    const emitted: number[] = [];
    component.transferWindowSelected.subscribe((id) => emitted.push(id));

    component['onTransferWindowChange'](transferWindows[1].id);

    expect(emitted).toEqual([transferWindows[1].id]);
    expect(component['visible']()).toBe(false);
  });

  it('should render a button for each transfer window', async () => {
    component.open();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getTransferWindowButtons()).toHaveLength(transferWindows.length);
  });

  it('should apply bg-surface-300 to selected transfer window button when not current', async () => {
    component.open();
    fixture.detectChanges();
    await fixture.whenStable();

    const transferWindowButtons = getTransferWindowButtons();
    expect(transferWindowButtons[0].classList).toContain('bg-surface-300');
    expect(transferWindowButtons[0].classList).not.toContain('bg-primary');
  });

  it('should apply bg-primary to currentId button', async () => {
    component.open();
    fixture.componentRef.setInput('currentId', transferWindows[1].id);
    fixture.detectChanges();
    await fixture.whenStable();

    const transferWindowButtons = getTransferWindowButtons();
    expect(transferWindowButtons[1].classList).toContain('bg-primary');
    expect(transferWindowButtons[1].classList).toContain('text-primary-contrast');
    expect(transferWindowButtons[0].classList).not.toContain('bg-primary');
  });

  it('should close when overlay is clicked', async () => {
    component.open();
    fixture.detectChanges();
    await fixture.whenStable();

    const overlay = document.body.querySelector('.fixed.inset-0') as HTMLElement;
    overlay.click();
    fixture.detectChanges();

    expect(component['visible']()).toBe(false);
  });

  it('should show in progress indicator for ACTIVE and FULL_TIME status', async () => {
    component.open();
    fixture.componentRef.setInput('transferWindows', [
      { ...fakeTransferWindow(), id: 1, transferWindowNumber: 1, status: Status.PENDING },
      { ...fakeTransferWindow(), id: 2, transferWindowNumber: 2, status: Status.ACTIVE },
      { ...fakeTransferWindow(), id: 3, transferWindowNumber: 3, status: Status.FULL_TIME },
      { ...fakeTransferWindow(), id: 4, transferWindowNumber: 4, status: Status.FINISHED },
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
