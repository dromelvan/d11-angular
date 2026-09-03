import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { CountryApiService, PlayerApiService } from '@app/core/api';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeCountry, fakePlayer, fakeSeason } from '@app/test';
import { CreatePlayerPageComponent } from './create-player-page.component';

describe('CreatePlayerPageComponent', () => {
  let fixture: ComponentFixture<CreatePlayerPageComponent>;
  let mockCurrentService: {
    season: ReturnType<typeof signal<ReturnType<typeof fakeSeason> | undefined>>;
  };
  let mockPageContextService: { register: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCurrentService = { season: signal(undefined) };
    mockPageContextService = { register: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CreatePlayerPageComponent],
      providers: [
        {
          provide: CountryApiService,
          useValue: { getCountries: vi.fn().mockReturnValue(of([fakeCountry()])) },
        },
        {
          provide: PlayerApiService,
          useValue: { createPlayer: vi.fn().mockReturnValue(of(fakePlayer())) },
        },
        { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
        { provide: CurrentService, useValue: mockCurrentService },
        { provide: PageContextService, useValue: mockPageContextService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePlayerPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the create player form', () => {
    expect(fixture.nativeElement.querySelector('app-create-player-form')).toBeInTheDocument();
  });

  // page context ----------------------------------------------------------------------------------

  describe('page context', () => {
    it('registers with title New Player', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.title()).toBe('New Player');
    });

    it('sets subtitle to Season name when current season is set', () => {
      const season = fakeSeason();
      mockCurrentService.season.set(season);

      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBe(`Season ${season.name}`);
    });

    it('has no subtitle when there is no current season', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBeUndefined();
    });

    it('registers with empty background color', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.backgroundColor()).toBe('');
    });
  });
});
