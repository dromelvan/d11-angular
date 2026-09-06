import { ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import {
  CountryApiService,
  PlayerApiService,
  PlayerSeasonStatApiService,
  PositionApiService,
  TeamApiService,
} from '@app/core/api';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { EditPlayerFormComponent } from '@app/feature/form/edit-player/edit-player-form.component';
import { fakePlayer, fakePlayerSeasonStat, fakeSeason } from '@app/test';
import { render } from '@testing-library/angular';
import { EditPlayerPageComponent } from './edit-player-page.component';

describe('EditPlayerPageComponent', () => {
  let fixture: ComponentFixture<EditPlayerPageComponent>;
  let mockCurrentService: {
    season: ReturnType<typeof signal<ReturnType<typeof fakeSeason> | undefined>>;
  };
  let mockPageContextService: { register: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();
    const playerSeasonStat = fakePlayerSeasonStat();
    mockCurrentService = { season: signal(playerSeasonStat.season) };
    mockPageContextService = { register: vi.fn() };

    ({ fixture } = await render(EditPlayerPageComponent, {
      inputs: { playerId: 1 },
      providers: [
        {
          provide: PlayerApiService,
          useValue: {
            getById: vi.fn().mockReturnValue(of(fakePlayer())),
            getPlayerSeasonStatsByPlayerId: vi.fn().mockReturnValue(of([playerSeasonStat])),
            updatePlayer: vi.fn(),
          },
        },
        { provide: PlayerSeasonStatApiService, useValue: { updatePlayerSeasonStat: vi.fn() } },
        { provide: CountryApiService, useValue: { getCountries: vi.fn().mockReturnValue(of([])) } },
        {
          provide: PositionApiService,
          useValue: { getPositions: vi.fn().mockReturnValue(of([])) },
        },
        { provide: TeamApiService, useValue: { getTeams: vi.fn().mockReturnValue(of([])) } },
        { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
        { provide: CurrentService, useValue: mockCurrentService },
        { provide: PageContextService, useValue: mockPageContextService },
      ],
    }));
  });

  it('renders the edit player form', () => {
    expect(fixture.nativeElement.querySelector('app-edit-player-form')).toBeInTheDocument();
  });

  it('passes playerId to EditPlayerFormComponent', () => {
    const editPlayerForm = fixture.debugElement.query(By.directive(EditPlayerFormComponent));
    expect(editPlayerForm.componentInstance.playerId()).toBe(1);
  });

  // page context ----------------------------------------------------------------------------------

  describe('page context', () => {
    it('registers with title Edit Player', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.title()).toBe('Edit Player');
    });

    it('sets subtitle to Season name when current season is set', () => {
      const season = fakeSeason();
      mockCurrentService.season.set(season);

      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBe(`Season ${season.name}`);
    });

    it('has no subtitle when there is no current season', () => {
      mockCurrentService.season.set(undefined);

      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBeUndefined();
    });

    it('registers with empty background color', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.backgroundColor()).toBe('');
    });
  });
});
