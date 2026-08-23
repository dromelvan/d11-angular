import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { TransferWindow, TransferWindowBase } from '@app/core/api';
import { TransferWindowApiService } from '@app/core/api/transfer-window/transfer-window-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { SafeDatePipe } from '@app/shared/pipes/safe-date.pipe';
import { fakeMatchWeekBase, fakeTransferWindow } from '@app/test';
import { TransferWindowScrollPickerComponent } from './transfer-window-scroll-picker.component';

describe('TransferWindowScrollPickerComponent', () => {
  let fixture: ComponentFixture<TransferWindowScrollPickerComponent>;
  let transferWindow: TransferWindow;
  let currentTransferWindow: TransferWindow;
  let transferWindowApi: Partial<TransferWindowApiService>;
  let mockCurrentService: {
    transferWindow: ReturnType<typeof signal<TransferWindowBase | undefined>>;
    rxCurrent: { isLoading: ReturnType<typeof signal<boolean>> };
  };

  async function setup(seasonId = transferWindow.season.id, transferWindowId?: number) {
    fixture = TestBed.createComponent(TransferWindowScrollPickerComponent);
    fixture.componentRef.setInput('seasonId', seasonId);
    if (transferWindowId !== undefined)
      fixture.componentRef.setInput('transferWindowId', transferWindowId);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();

    transferWindow = fakeTransferWindow();
    currentTransferWindow = fakeTransferWindow();

    transferWindowApi = {
      getTransferWindowsBySeasonId: vi
        .fn()
        .mockReturnValue(of([transferWindow, currentTransferWindow])),
    };

    mockCurrentService = {
      transferWindow: signal<TransferWindowBase | undefined>(currentTransferWindow),
      rxCurrent: { isLoading: signal(false) },
    };

    await TestBed.configureTestingModule({
      imports: [TransferWindowScrollPickerComponent],
      providers: [
        { provide: TransferWindowApiService, useValue: transferWindowApi },
        { provide: CurrentService, useValue: mockCurrentService },
        { provide: LoadingService, useValue: { register: vi.fn() } },
      ],
    }).compileComponents();

    await setup();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calls getTransferWindowsBySeasonId with the season id', () => {
    expect(transferWindowApi.getTransferWindowsBySeasonId).toHaveBeenCalledWith(
      transferWindow.season.id,
    );
  });

  it('calls getTransferWindowsBySeasonId again when seasonId input changes', async () => {
    const newSeasonId = transferWindow.season.id + 1;

    fixture.componentRef.setInput('seasonId', newSeasonId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(transferWindowApi.getTransferWindowsBySeasonId).toHaveBeenCalledWith(newSeasonId);
  });

  it('renders a scroll picker item for each transfer window', () => {
    const button = fixture.nativeElement.querySelector(`[data-id="${transferWindow.id}"]`);
    expect(button).not.toBeNull();
  });

  it('renders the transfer window number label in the scroll picker', () => {
    expect(fixture.nativeElement.textContent).toContain(
      `TW ${transferWindow.transferWindowNumber}`,
    );
  });

  it('renders Draft label for a draft transfer window', async () => {
    const draftTransferWindow = { ...transferWindow, draft: true };
    (transferWindowApi.getTransferWindowsBySeasonId as ReturnType<typeof vi.fn>).mockReturnValue(
      of([draftTransferWindow]),
    );

    fixture = TestBed.createComponent(TransferWindowScrollPickerComponent);
    fixture.componentRef.setInput('seasonId', draftTransferWindow.season.id);
    fixture.componentRef.setInput('transferWindowId', draftTransferWindow.id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Draft');
  });

  it('renders the transfer window date in the scroll picker', () => {
    const expected = new SafeDatePipe().transform(transferWindow.datetime, 'd MMM');
    expect(fixture.nativeElement.textContent).toContain(expected);
  });

  it('does not render the scroll picker when there are no transfer windows', async () => {
    (transferWindowApi.getTransferWindowsBySeasonId as ReturnType<typeof vi.fn>).mockReturnValue(
      of([]),
    );

    fixture.componentRef.setInput('seasonId', transferWindow.season.id + 1);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-scroll-picker')).toBeNull();
  });

  it('emits the full transfer window when a scroll picker item is clicked', () => {
    const emitted: TransferWindow[] = [];
    fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

    const button = fixture.nativeElement.querySelector(`[data-id="${transferWindow.id}"]`);
    button.click();

    expect(emitted).toEqual([transferWindow]);
  });

  it('applies border-white to the current transfer window button', () => {
    const button = fixture.nativeElement.querySelector(`[data-id="${currentTransferWindow.id}"]`);
    expect(button.classList).toContain('border-white');
  });

  it('defaults to the current transfer window as selected when transferWindowId is not provided', () => {
    const currentButton = fixture.nativeElement.querySelector(
      `[data-id="${currentTransferWindow.id}"]`,
    );
    const otherButton = fixture.nativeElement.querySelector(`[data-id="${transferWindow.id}"]`);
    expect(currentButton.classList).toContain('bg-primary-300');
    expect(otherButton.classList).not.toContain('bg-primary-300');
  });

  it('selects the transfer window matching transferWindowId when provided', async () => {
    await setup(transferWindow.season.id, transferWindow.id);

    const selectedButton = fixture.nativeElement.querySelector(`[data-id="${transferWindow.id}"]`);
    const otherButton = fixture.nativeElement.querySelector(
      `[data-id="${currentTransferWindow.id}"]`,
    );
    expect(selectedButton.classList).toContain('bg-primary-300');
    expect(otherButton.classList).not.toContain('bg-primary-300');
  });

  it('defaults to the first transfer window when the current transfer window is not in the season', async () => {
    const outsideTransferWindow = { ...fakeTransferWindow(), id: 99999 };
    mockCurrentService.transferWindow.set(outsideTransferWindow);

    fixture = TestBed.createComponent(TransferWindowScrollPickerComponent);
    fixture.componentInstance.transferWindowSelected.subscribe(() => {});
    fixture.componentRef.setInput('seasonId', transferWindow.season.id);
    fixture.detectChanges();
    await fixture.whenStable();

    const firstButton = fixture.nativeElement.querySelector(`[data-id="${transferWindow.id}"]`);
    expect(firstButton.classList).toContain('bg-primary-300');
  });

  it('uses CurrentService transferWindow to mark the current transfer window', () => {
    const currentButton = fixture.nativeElement.querySelector(
      `[data-id="${currentTransferWindow.id}"]`,
    );
    expect(currentButton.classList).toContain('border-white');
  });

  it('emits the current transfer window on initial load', async () => {
    const emitted: TransferWindow[] = [];

    fixture = TestBed.createComponent(TransferWindowScrollPickerComponent);
    fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));
    fixture.componentRef.setInput('seasonId', transferWindow.season.id);
    fixture.detectChanges();
    await fixture.whenStable();
    TestBed.tick();

    expect(emitted).toEqual([currentTransferWindow]);
  });

  it('re-emits the default transfer window when seasonId changes', async () => {
    const newSeasonId = transferWindow.season.id + 1;
    const newSeason = { ...transferWindow.season, id: newSeasonId };
    const newTransferWindow = {
      ...fakeTransferWindow(),
      season: newSeason,
      matchWeek: { ...fakeMatchWeekBase(), season: newSeason },
    };
    const currentTransferWindowInNewSeason = {
      ...currentTransferWindow,
      season: newSeason,
      matchWeek: { ...currentTransferWindow.matchWeek, season: newSeason },
    };
    (transferWindowApi.getTransferWindowsBySeasonId as ReturnType<typeof vi.fn>).mockReturnValue(
      of([newTransferWindow, currentTransferWindowInNewSeason]),
    );

    const emitted: TransferWindow[] = [];
    fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

    fixture.componentRef.setInput('seasonId', newSeasonId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted.length).toBe(1);
    expect(emitted[0].id).toBe(currentTransferWindow.id);
  });

  it('does not emit when loaded transfer windows belong to a different season', async () => {
    const emitted: TransferWindow[] = [];
    fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

    fixture.componentRef.setInput('seasonId', transferWindow.season.id + 99);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted).toEqual([]);
  });

  it('does not emit when transferWindowId is set but not found in the current season', async () => {
    const newSeasonId = transferWindow.season.id + 1;
    const newSeason = { ...transferWindow.season, id: newSeasonId };
    const newTransferWindow = {
      ...fakeTransferWindow(),
      season: newSeason,
      matchWeek: { ...fakeMatchWeekBase(), season: newSeason },
    };
    const currentTransferWindowInNewSeason = {
      ...currentTransferWindow,
      season: newSeason,
      matchWeek: { ...currentTransferWindow.matchWeek, season: newSeason },
    };
    (transferWindowApi.getTransferWindowsBySeasonId as ReturnType<typeof vi.fn>).mockReturnValue(
      of([newTransferWindow, currentTransferWindowInNewSeason]),
    );

    const emitted: TransferWindow[] = [];
    fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

    fixture.componentRef.setInput('transferWindowId', transferWindow.id);
    fixture.componentRef.setInput('seasonId', newSeasonId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted).toEqual([]);
  });
});
