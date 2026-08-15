import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Season, SeasonBase } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { fakeSeason } from '@app/test';
import { SeasonScrollPickerComponent } from './season-scroll-picker.component';

describe('SeasonScrollPickerComponent', () => {
  let fixture: ComponentFixture<SeasonScrollPickerComponent>;
  let season1: Season;
  let currentSeason: Season;
  let mockSeasonApi: Partial<SeasonApiService>;
  let mockCurrentService: {
    season: ReturnType<typeof signal<SeasonBase | undefined>>;
    rxCurrent: { isLoading: ReturnType<typeof signal<boolean>> };
  };

  async function setup(seasonId?: number) {
    fixture = TestBed.createComponent(SeasonScrollPickerComponent);
    if (seasonId !== undefined) fixture.componentRef.setInput('seasonId', seasonId);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();

    season1 = { ...fakeSeason(), id: 1 };
    currentSeason = { ...fakeSeason(), id: 2 };

    mockSeasonApi = {
      getAll: vi.fn().mockReturnValue(of([season1, currentSeason])),
    };

    mockCurrentService = {
      season: signal<SeasonBase | undefined>(currentSeason),
      rxCurrent: { isLoading: signal(false) },
    };

    await TestBed.configureTestingModule({
      imports: [SeasonScrollPickerComponent],
      providers: [
        { provide: SeasonApiService, useValue: mockSeasonApi },
        { provide: CurrentService, useValue: mockCurrentService },
        { provide: LoadingService, useValue: { register: vi.fn() } },
      ],
    }).compileComponents();

    await setup();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('calls getAll', () => {
    expect(mockSeasonApi.getAll).toHaveBeenCalled();
  });

  it('renders a scroll picker item for each season', () => {
    const button = fixture.nativeElement.querySelector(`[data-id="${season1.id}"]`);
    expect(button).not.toBeNull();
  });

  it('renders the season short name label in the scroll picker', () => {
    expect(fixture.nativeElement.textContent).toContain(season1.shortName);
  });

  it('does not render the scroll picker when there are no seasons', async () => {
    (mockSeasonApi.getAll as ReturnType<typeof vi.fn>).mockReturnValue(of([]));

    fixture = TestBed.createComponent(SeasonScrollPickerComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('app-scroll-picker')).toBeNull();
  });

  it('emits the full season when a scroll picker item is clicked', () => {
    const emitted: Season[] = [];
    fixture.componentInstance.seasonSelected.subscribe((s) => emitted.push(s));

    const button = fixture.nativeElement.querySelector(`[data-id="${season1.id}"]`);
    button.click();

    expect(emitted).toEqual([season1]);
  });

  it('applies border-white to the current season button', () => {
    const button = fixture.nativeElement.querySelector(`[data-id="${currentSeason.id}"]`);
    expect(button.classList).toContain('border-white');
  });

  it('defaults to the current season as selected when seasonId is not provided', () => {
    const otherButton = fixture.nativeElement.querySelector(`[data-id="${season1.id}"]`);
    expect(otherButton.classList).not.toContain('bg-primary-300');
  });

  it('defaults to the first season when the current season is not in the list', async () => {
    const outsideSeason = { ...fakeSeason(), id: 99999 };
    mockCurrentService.season.set(outsideSeason);

    fixture = TestBed.createComponent(SeasonScrollPickerComponent);
    fixture.componentInstance.seasonSelected.subscribe(() => {});
    fixture.detectChanges();
    await fixture.whenStable();

    const firstButton = fixture.nativeElement.querySelector(`[data-id="${season1.id}"]`);
    expect(firstButton.classList).toContain('bg-primary-300');
  });

  it('emits the current season on initial load', async () => {
    const emitted: Season[] = [];

    fixture = TestBed.createComponent(SeasonScrollPickerComponent);
    fixture.componentInstance.seasonSelected.subscribe((s) => emitted.push(s));
    fixture.detectChanges();
    await fixture.whenStable();
    TestBed.tick();

    expect(emitted).toEqual([currentSeason]);
  });

  it('does not emit when seasonId is set and matches a season in the list', async () => {
    const emitted: Season[] = [];

    fixture = TestBed.createComponent(SeasonScrollPickerComponent);
    fixture.componentInstance.seasonSelected.subscribe((s) => emitted.push(s));
    fixture.componentRef.setInput('seasonId', season1.id);
    fixture.detectChanges();
    await fixture.whenStable();
    TestBed.tick();

    expect(emitted).toEqual([]);
  });

  it('does not emit when seasonId is set but not found in the list', async () => {
    const emitted: Season[] = [];

    fixture = TestBed.createComponent(SeasonScrollPickerComponent);
    fixture.componentInstance.seasonSelected.subscribe((s) => emitted.push(s));
    fixture.componentRef.setInput('seasonId', 99999);
    fixture.detectChanges();
    await fixture.whenStable();
    TestBed.tick();

    expect(emitted).toEqual([]);
  });
});
