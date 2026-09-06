import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import {
  CountryApiService,
  PlayerApiService,
  PlayerSeasonStatApiService,
  PositionApiService,
  TeamApiService,
} from '@app/core/api';
import { Country } from '@app/core/api/model/country.model';
import { Position } from '@app/core/api/model/position.model';
import { SeasonBase } from '@app/core/api/model/season-base.model';
import { TeamBase } from '@app/core/api/model/team-base.model';
import { CurrentService } from '@app/core/current/current.service';
import { RouterService } from '@app/core/router/router.service';
import {
  fakeCountry,
  fakePlayer,
  fakePlayerSeasonStat,
  fakePosition,
  fakeTeamBase,
} from '@app/test';
import { EditPlayerFormComponent } from './edit-player-form.component';

const validFormValue = {
  firstName: 'Test',
  lastName: 'Player',
  fullName: 'Test Player',
  statSourceId: 1,
  premierLeagueId: 2,
  dateOfBirth: '1990-01-01',
  height: 180,
  country: null as Country | null,
  position: null as Position | null,
  team: null as TeamBase | null,
};

describe('EditPlayerFormComponent', () => {
  let fixture: ComponentFixture<EditPlayerFormComponent>;
  let component: EditPlayerFormComponent;
  let mockCountryApiService: { getCountries: ReturnType<typeof vi.fn> };
  let mockPlayerApiService: {
    getById: ReturnType<typeof vi.fn>;
    getPlayerSeasonStatsByPlayerId: ReturnType<typeof vi.fn>;
    updatePlayer: ReturnType<typeof vi.fn>;
  };
  let mockPlayerSeasonStatApiService: { updatePlayerSeasonStat: ReturnType<typeof vi.fn> };
  let mockPositionApiService: { getPositions: ReturnType<typeof vi.fn> };
  let mockRouterService: { navigateToPlayer: ReturnType<typeof vi.fn> };
  let mockTeamApiService: { getTeams: ReturnType<typeof vi.fn> };
  let mockCurrentService: { season: ReturnType<typeof signal<SeasonBase | undefined>> };
  let player: ReturnType<typeof fakePlayer>;
  let playerSeasonStat: ReturnType<typeof fakePlayerSeasonStat>;
  let countries: Country[];
  let positions: Position[];
  let teams: TeamBase[];

  beforeEach(async () => {
    vi.clearAllMocks();
    player = fakePlayer();
    playerSeasonStat = fakePlayerSeasonStat();
    countries = [fakeCountry(), fakeCountry()];
    positions = [fakePosition(), fakePosition()];
    teams = [fakeTeamBase(), fakeTeamBase()];

    mockCountryApiService = { getCountries: vi.fn().mockReturnValue(of(countries)) };
    mockPlayerApiService = {
      getById: vi.fn().mockReturnValue(of(player)),
      getPlayerSeasonStatsByPlayerId: vi.fn().mockReturnValue(of([playerSeasonStat])),
      updatePlayer: vi.fn().mockReturnValue(of(player)),
    };
    mockPlayerSeasonStatApiService = {
      updatePlayerSeasonStat: vi.fn().mockReturnValue(of(playerSeasonStat)),
    };
    mockPositionApiService = { getPositions: vi.fn().mockReturnValue(of(positions)) };
    mockRouterService = { navigateToPlayer: vi.fn().mockResolvedValue(true) };
    mockTeamApiService = { getTeams: vi.fn().mockReturnValue(of(teams)) };
    mockCurrentService = { season: signal<SeasonBase | undefined>(playerSeasonStat.season) };

    await TestBed.configureTestingModule({
      imports: [EditPlayerFormComponent],
      providers: [
        { provide: CountryApiService, useValue: mockCountryApiService },
        { provide: PlayerApiService, useValue: mockPlayerApiService },
        { provide: PlayerSeasonStatApiService, useValue: mockPlayerSeasonStatApiService },
        { provide: PositionApiService, useValue: mockPositionApiService },
        { provide: RouterService, useValue: mockRouterService },
        { provide: TeamApiService, useValue: mockTeamApiService },
        { provide: CurrentService, useValue: mockCurrentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPlayerFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('playerId', 1);
    fixture.detectChanges();
    await fixture.whenStable();
    TestBed.tick();
  });

  it('loads player on init', () => {
    expect(mockPlayerApiService.getById).toHaveBeenCalledWith(1);
  });

  it('loads player season stats on init', () => {
    expect(mockPlayerApiService.getPlayerSeasonStatsByPlayerId).toHaveBeenCalledWith(1);
  });

  it('loads countries on init', () => {
    expect(mockCountryApiService.getCountries).toHaveBeenCalled();
  });

  it('loads positions on init', () => {
    expect(mockPositionApiService.getPositions).toHaveBeenCalled();
  });

  it('loads teams on init', () => {
    expect(mockTeamApiService.getTeams).toHaveBeenCalled();
  });

  it('renders all form fields', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('#firstName')).toBeInTheDocument();
    expect(host.querySelector('#lastName')).toBeInTheDocument();
    expect(host.querySelector('#fullName')).toBeInTheDocument();
    expect(host.querySelector('#position')).toBeInTheDocument();
    expect(host.querySelector('#team')).toBeInTheDocument();
    expect(host.querySelector('#statSourceId')).toBeInTheDocument();
    expect(host.querySelector('#premierLeagueId')).toBeInTheDocument();
    expect(host.querySelector('#dateOfBirth')).toBeInTheDocument();
    expect(host.querySelector('#height')).toBeInTheDocument();
    expect(host.querySelector('#country')).toBeInTheDocument();
  });

  it('pre-populates form fields from player and playerSeasonStat', () => {
    expect(component['form'].value.firstName).toBe(player.firstName);
    expect(component['form'].value.lastName).toBe(player.lastName);
    expect(component['form'].value.fullName).toBe(player.fullName);
    expect(component['form'].value.statSourceId).toBe(player.statSourceId);
    expect(component['form'].value.premierLeagueId).toBe(player.premierLeagueId);
    expect(component['form'].value.dateOfBirth).toBe(player.dateOfBirth);
    expect(component['form'].value.height).toBe(player.height);
    expect(component['form'].value.country).toEqual(player.country);
    expect(component['form'].value.position).toEqual(playerSeasonStat.position);
    expect(component['form'].value.team).toEqual(playerSeasonStat.team);
  });

  it('does not overwrite form values after initial patch when season re-emits', () => {
    component['form'].controls.lastName.setValue('edited');

    mockCurrentService.season.set({ ...playerSeasonStat.season });
    TestBed.tick();

    expect(component['form'].value.lastName).toBe('edited');
  });

  // onCountrySearch -------------------------------------------------------------------------------

  describe('onCountrySearch', () => {
    it('filters countries by query', () => {
      const query = countries[0].name.substring(0, 3).toLowerCase();
      component['onCountrySearch']({ query });

      expect(component['countries']()).toContain(countries[0]);
    });

    it('returns empty list when no country matches', () => {
      component['onCountrySearch']({ query: '---no match---' });

      expect(component['countries']()).toEqual([]);
    });
  });

  // onPositionSearch ------------------------------------------------------------------------------

  describe('onPositionSearch', () => {
    it('filters positions by query', () => {
      const query = positions[0].name.substring(0, 3).toLowerCase();
      component['onPositionSearch']({ query });

      expect(component['positions']()).toContain(positions[0]);
    });

    it('returns empty list when no position matches', () => {
      component['onPositionSearch']({ query: '---no match---' });

      expect(component['positions']()).toEqual([]);
    });
  });

  // onTeamSearch ----------------------------------------------------------------------------------

  describe('onTeamSearch', () => {
    it('filters teams by query', () => {
      const query = teams[0].name.substring(0, 3).toLowerCase();
      component['onTeamSearch']({ query });

      expect(component['teams']()).toContain(teams[0]);
    });

    it('returns empty list when no team matches', () => {
      component['onTeamSearch']({ query: '---no match---' });

      expect(component['teams']()).toEqual([]);
    });
  });

  // onSubmit --------------------------------------------------------------------------------------

  describe('onSubmit', () => {
    it('marks all fields as touched when form is invalid', () => {
      component['form'].controls.lastName.setValue('');
      component['form'].controls.position.setValue(null);
      component['form'].controls.team.setValue(null);

      component['onSubmit']();

      expect(component['form'].touched).toBe(true);
    });

    it('does not call updatePlayer when form is invalid', () => {
      component['form'].controls.lastName.setValue('');
      component['form'].controls.position.setValue(null);
      component['form'].controls.team.setValue(null);

      component['onSubmit']();

      expect(mockPlayerApiService.updatePlayer).not.toHaveBeenCalled();
    });

    it('calls updatePlayer with playerId and form value on valid submit', async () => {
      const updatedPlayer = fakePlayer();
      mockPlayerApiService.updatePlayer.mockReturnValue(of(updatedPlayer));
      component['form'].setValue({
        ...validFormValue,
        country: countries[0],
        position: positions[0],
        team: teams[0],
      });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockPlayerApiService.updatePlayer).toHaveBeenCalledWith(1, {
        firstName: validFormValue.firstName,
        lastName: validFormValue.lastName,
        fullName: validFormValue.fullName,
        statSourceId: validFormValue.statSourceId,
        premierLeagueId: validFormValue.premierLeagueId,
        dateOfBirth: validFormValue.dateOfBirth,
        height: validFormValue.height,
        countryId: countries[0].id,
      });
    });

    it('calls updatePlayerSeasonStat with playerSeasonStatId, form position and team, and existing d11TeamId', async () => {
      const { position, team } = component['form'].getRawValue();

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockPlayerSeasonStatApiService.updatePlayerSeasonStat).toHaveBeenCalledWith(
        playerSeasonStat.id,
        {
          positionId: position!.id,
          teamId: team!.id,
          d11TeamId: playerSeasonStat.d11Team.id,
        },
      );
    });

    it('defaults null country to country with id 1', async () => {
      component['form'].patchValue({ country: null });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockPlayerApiService.updatePlayer).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ countryId: 1 }),
      );
    });

    it('defaults null fullName to undefined', async () => {
      component['form'].patchValue({ fullName: null });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      const called = mockPlayerApiService.updatePlayer.mock.calls[0][1] as Record<string, unknown>;
      expect(called['fullName']).toBeUndefined();
    });

    it('defaults null statSourceId, premierLeagueId and height to 0', async () => {
      component['form'].patchValue({ statSourceId: null, premierLeagueId: null, height: null });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockPlayerApiService.updatePlayer).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ statSourceId: 0, premierLeagueId: 0, height: 0 }),
      );
    });

    it('navigates to player after both calls complete', async () => {
      component['form'].setValue({
        ...validFormValue,
        country: countries[0],
        position: positions[0],
        team: teams[0],
      });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockRouterService.navigateToPlayer).toHaveBeenCalledWith(1);
    });
  });
});
