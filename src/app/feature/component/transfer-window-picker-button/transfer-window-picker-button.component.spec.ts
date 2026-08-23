import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SeasonBase, TransferWindow, TransferWindowBase } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { TransferWindowApiService } from '@app/core/api/transfer-window/transfer-window-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { fakeSeasonBase, fakeTransferWindow } from '@app/test';
import { TransferWindowPickerDrawerComponent } from '@app/feature/component/transfer-window-picker-drawer/transfer-window-picker-drawer.component';
import { TransferWindowPickerButtonComponent } from './transfer-window-picker-button.component';

describe('TransferWindowPickerButtonComponent', () => {
  let fixture: ComponentFixture<TransferWindowPickerButtonComponent>;
  let transferWindow: TransferWindow;
  let seasons: SeasonBase[];
  let mockCurrentService: {
    transferWindow: ReturnType<typeof signal<TransferWindowBase | undefined>>;
    season: ReturnType<typeof signal<SeasonBase | undefined>>;
    rxCurrent: { isLoading: ReturnType<typeof signal<boolean>> };
  };

  async function setup() {
    fixture = TestBed.createComponent(TransferWindowPickerButtonComponent);
    fixture.componentRef.setInput('seasonId', transferWindow.season.id);
    fixture.componentRef.setInput('transferWindowId', transferWindow.id);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    transferWindow = fakeTransferWindow();

    seasons = [
      { ...fakeSeasonBase(), id: 1, shortName: '23-24' },
      { ...fakeSeasonBase(), id: 2, shortName: '24-25' },
    ];

    mockCurrentService = {
      transferWindow: signal<TransferWindowBase | undefined>(transferWindow),
      season: signal<SeasonBase | undefined>(transferWindow.season),
      rxCurrent: { isLoading: signal(false) },
    };

    await TestBed.configureTestingModule({
      imports: [TransferWindowPickerButtonComponent],
      providers: [
        {
          provide: TransferWindowApiService,
          useValue: {
            getTransferWindowsBySeasonId: vi.fn().mockReturnValue(of([transferWindow])),
          },
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

  it('emits transferWindowSelected with the full transfer window when the drawer emits a selection', () => {
    const emitted: TransferWindow[] = [];
    fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;
    drawer.transferWindowSelected.emit(transferWindow.id);

    expect(emitted).toEqual([transferWindow]);
  });

  it('does not emit transferWindowSelected when drawer emits an unknown id', () => {
    const emitted: TransferWindow[] = [];
    fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;
    drawer.transferWindowSelected.emit(transferWindow.id + 999);

    expect(emitted).toHaveLength(0);
  });

  it('passes transferWindowId as selectedId to the drawer', () => {
    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;

    expect(drawer.selectedId()).toBe(transferWindow.id);
  });

  it('passes current transfer window id as currentId to the drawer', () => {
    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;

    expect(drawer.currentId()).toBe(transferWindow.id);
  });

  it('returns empty transfer windows when loaded season does not match seasonId input', async () => {
    const differentSeasonId = transferWindow.season.id + 1;
    fixture.componentRef.setInput('seasonId', differentSeasonId);
    fixture.detectChanges();
    await fixture.whenStable();

    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;
    expect(drawer.transferWindows()).toHaveLength(0);
  });

  it('passes seasons to the drawer', () => {
    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;

    expect(drawer.seasons()).toEqual(seasons);
  });

  it('passes current season id to the drawer', () => {
    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;

    expect(drawer.currentSeasonId()).toBe(transferWindow.season.id);
  });

  it('passes seasonId as selectedSeasonId to the drawer initially', () => {
    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;

    expect(drawer.selectedSeasonId()).toBe(transferWindow.season.id);
  });

  it('updates selectedSeasonId when drawer emits seasonSelected', async () => {
    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;

    drawer.seasonSelected.emit(seasons[0].id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(drawer.selectedSeasonId()).toBe(seasons[0].id);
  });

  it('emits transferWindowSelected with the latest transfer window when a season is selected', async () => {
    const emitted: TransferWindow[] = [];
    fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;
    drawer.seasonSelected.emit(transferWindow.season.id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted).toEqual([transferWindow]);
  });

  it('emits the first transfer window in the API response (latest) when season is selected with multiple windows', async () => {
    const olderTransferWindow = {
      ...fakeTransferWindow(),
      id: transferWindow.id - 1,
      season: transferWindow.season,
      matchWeek: { ...transferWindow.matchWeek },
    };
    TestBed.inject(TransferWindowApiService).getTransferWindowsBySeasonId = vi
      .fn()
      .mockReturnValue(of([transferWindow, olderTransferWindow]));

    fixture = TestBed.createComponent(TransferWindowPickerButtonComponent);
    fixture.componentRef.setInput('seasonId', transferWindow.season.id);
    fixture.detectChanges();
    await fixture.whenStable();

    const emitted: TransferWindow[] = [];
    fixture.componentInstance.transferWindowSelected.subscribe((tw) => emitted.push(tw));

    const drawer = fixture.debugElement.query(By.directive(TransferWindowPickerDrawerComponent))
      .componentInstance as TransferWindowPickerDrawerComponent;
    drawer.seasonSelected.emit(transferWindow.season.id);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(emitted[0]).toEqual(transferWindow);
  });
});
