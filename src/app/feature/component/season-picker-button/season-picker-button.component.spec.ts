import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Season, SeasonBase } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { fakeSeason } from '@app/test';
import { SeasonPickerDrawerComponent } from '@app/feature/component/season-picker-drawer/season-picker-drawer.component';
import { SeasonPickerButtonComponent } from './season-picker-button.component';

describe('SeasonPickerButtonComponent', () => {
  let fixture: ComponentFixture<SeasonPickerButtonComponent>;
  let season1: Season;
  let season2: Season;
  let mockCurrentService: {
    season: ReturnType<typeof signal<SeasonBase | undefined>>;
    rxCurrent: { isLoading: ReturnType<typeof signal<boolean>> };
  };

  async function setup() {
    fixture = TestBed.createComponent(SeasonPickerButtonComponent);
    fixture.componentRef.setInput('seasonId', season1.id);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    season1 = { ...fakeSeason(), id: 1 };
    season2 = { ...fakeSeason(), id: 2 };

    mockCurrentService = {
      season: signal<SeasonBase | undefined>(season2),
      rxCurrent: { isLoading: signal(false) },
    };

    await TestBed.configureTestingModule({
      imports: [SeasonPickerButtonComponent],
      providers: [
        {
          provide: SeasonApiService,
          useValue: { getAll: vi.fn().mockReturnValue(of([season1, season2])) },
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

  it('calls getAll on init', () => {
    const seasonApiService = TestBed.inject(SeasonApiService);
    expect(seasonApiService.getAll).toHaveBeenCalled();
  });

  it('renders a more button', () => {
    expect(fixture.nativeElement.querySelector('button')).toBeInTheDocument();
  });

  it('opens the drawer on more button click', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.fixed.inset-0')).toBeInTheDocument();
  });

  it('emits seasonSelected with the full season when the drawer emits a selection', () => {
    const emitted: Season[] = [];
    fixture.componentInstance.seasonSelected.subscribe((s) => emitted.push(s));

    const drawer = fixture.debugElement.query(By.directive(SeasonPickerDrawerComponent))
      .componentInstance as SeasonPickerDrawerComponent;
    drawer.seasonSelected.emit(season1.id);

    expect(emitted).toEqual([season1]);
  });

  it('does not emit seasonSelected when drawer emits an unknown id', () => {
    const emitted: Season[] = [];
    fixture.componentInstance.seasonSelected.subscribe((s) => emitted.push(s));

    const drawer = fixture.debugElement.query(By.directive(SeasonPickerDrawerComponent))
      .componentInstance as SeasonPickerDrawerComponent;
    drawer.seasonSelected.emit(season1.id + 9999);

    expect(emitted).toHaveLength(0);
  });

  it('passes seasons to the drawer', () => {
    const drawer = fixture.debugElement.query(By.directive(SeasonPickerDrawerComponent))
      .componentInstance as SeasonPickerDrawerComponent;

    expect(drawer.seasons()).toEqual([season1, season2]);
  });

  it('passes current season id to the drawer', () => {
    const drawer = fixture.debugElement.query(By.directive(SeasonPickerDrawerComponent))
      .componentInstance as SeasonPickerDrawerComponent;

    expect(drawer.currentSeasonId()).toBe(season2.id);
  });

  it('passes seasonId as selectedSeasonId to the drawer', () => {
    const drawer = fixture.debugElement.query(By.directive(SeasonPickerDrawerComponent))
      .componentInstance as SeasonPickerDrawerComponent;

    expect(drawer.selectedSeasonId()).toBe(season1.id);
  });
});
