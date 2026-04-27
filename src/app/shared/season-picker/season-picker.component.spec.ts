import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Season, SeasonBase } from '@app/core/api';
import { SeasonApiService } from '@app/core/api/season/season-api.service';
import { fakeSeason } from '@app/test';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import { IconButtonComponent } from '@app/shared/button/icon-button/icon-button.component';
import { SeasonPickerComponent } from './season-picker.component';

describe('SeasonPickerComponent', () => {
  let fixture: ComponentFixture<SeasonPickerComponent>;
  let component: SeasonPickerComponent;
  let seasons: Season[];
  let emittedSeasons: SeasonBase[];

  const mockSeasonApi = {
    getAll: vi.fn<() => Observable<Season[]>>(),
  };

  const setup = async () => {
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    emittedSeasons = [];

    seasons = [
      { ...fakeSeason(), id: 1, date: '2024-08-01', name: 'Season 2024-25' },
      { ...fakeSeason(), id: 2, date: '2023-08-01', name: 'Season 2023-24' },
      { ...fakeSeason(), id: 3, date: '2022-08-01', name: 'Season 2022-23' },
    ];
    mockSeasonApi.getAll.mockReturnValue(of(seasons));

    await TestBed.configureTestingModule({
      imports: [SeasonPickerComponent],
      providers: [{ provide: SeasonApiService, useValue: mockSeasonApi }],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonPickerComponent);
    component = fixture.componentInstance;
    component.season.subscribe((s) => emittedSeasons.push(s));
    await setup();
  });

  const iconButtons = () => fixture.debugElement.queryAll(By.directive(IconButtonComponent));

  const clickPrevious = async () => {
    iconButtons()[0].triggerEventHandler('click');
    await setup();
  };

  const clickNext = async () => {
    iconButtons()[1].triggerEventHandler('click');
    await setup();
  };

  const prevDisabled = () => iconButtons()[0].componentInstance.disabled();
  const nextDisabled = () => iconButtons()[1].componentInstance.disabled();

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  // Initial season --------------------------------------------------------------------------------

  describe('initial season', () => {
    it('displays the most recent season name by default', () => {
      expect(fixture.nativeElement.textContent).toContain('Season 2024-25');
    });

    it('displays the season matching seasonId', async () => {
      fixture.componentRef.setInput('seasonId', 2);
      await setup();

      expect(fixture.nativeElement.textContent).toContain('Season 2023-24');
    });

    it('emits the most recent season on load when no seasonId', () => {
      expect(emittedSeasons[0]?.id).toBe(1);
    });

    it('does not emit when seasonId is provided', async () => {
      fixture.componentRef.setInput('seasonId', 3);
      await setup();

      expect(emittedSeasons).toHaveLength(1);
      expect(emittedSeasons[0].id).toBe(1);
    });
  });

  // Previous button -------------------------------------------------------------------------------

  describe('previous button (older season)', () => {
    it('is disabled at the oldest season', async () => {
      fixture.componentRef.setInput('seasonId', 3);
      await setup();

      expect(prevDisabled()).toBe(true);
    });

    it('is enabled when not at the oldest season', () => {
      expect(prevDisabled()).toBe(false);
    });

    it('displays the older season after click', async () => {
      await clickPrevious();

      expect(fixture.nativeElement.textContent).toContain('Season 2023-24');
    });

    it('emits the older season after click', async () => {
      await clickPrevious();

      expect(emittedSeasons.at(-1)?.id).toBe(2);
    });
  });

  // Next button -----------------------------------------------------------------------------------

  describe('next button (newer season)', () => {
    it('is disabled at the newest season', () => {
      expect(nextDisabled()).toBe(true);
    });

    it('is enabled when not at the newest season', async () => {
      fixture.componentRef.setInput('seasonId', 2);
      await setup();

      expect(nextDisabled()).toBe(false);
    });

    it('displays the newer season after click', async () => {
      fixture.componentRef.setInput('seasonId', 2);
      await setup();

      await clickNext();

      expect(fixture.nativeElement.textContent).toContain('Season 2024-25');
    });

    it('emits the newer season after click', async () => {
      fixture.componentRef.setInput('seasonId', 2);
      await setup();

      await clickNext();

      expect(emittedSeasons.at(-1)?.id).toBe(1);
    });
  });
});
