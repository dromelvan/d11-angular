import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { TeamBase } from '@app/core/api/model/team-base.model';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import {
  fakeCountry,
  fakePlayer,
  fakePlayerSeasonStat,
  fakePosition,
  fakeTeamBase,
} from '@app/test';
import { CreatePlayerComponent } from './create-player.component';

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

describe('CreatePlayerComponent', () => {
  let fixture: ComponentFixture<CreatePlayerComponent>;
  let component: CreatePlayerComponent;
  let mockCountryApiService: { getCountries: ReturnType<typeof vi.fn> };
  let mockPlayerApiService: { createPlayer: ReturnType<typeof vi.fn> };
  let mockPlayerSeasonStatApiService: { createPlayerSeasonStat: ReturnType<typeof vi.fn> };
  let mockPositionApiService: { getPositions: ReturnType<typeof vi.fn> };
  let mockRouterService: { navigateToPlayer: ReturnType<typeof vi.fn> };
  let mockTeamApiService: { getTeams: ReturnType<typeof vi.fn> };
  let mockLoadingService: { register: ReturnType<typeof vi.fn> };
  let countries: Country[];
  let positions: Position[];
  let teams: TeamBase[];

  beforeEach(async () => {
    vi.clearAllMocks();
    countries = [fakeCountry(), fakeCountry()];
    positions = [fakePosition(), fakePosition()];
    teams = [fakeTeamBase(), fakeTeamBase()];
    mockCountryApiService = { getCountries: vi.fn().mockReturnValue(of(countries)) };
    mockPlayerApiService = { createPlayer: vi.fn().mockReturnValue(of(fakePlayer())) };
    mockPlayerSeasonStatApiService = {
      createPlayerSeasonStat: vi.fn().mockReturnValue(of(fakePlayerSeasonStat())),
    };
    mockPositionApiService = { getPositions: vi.fn().mockReturnValue(of(positions)) };
    mockRouterService = { navigateToPlayer: vi.fn().mockResolvedValue(true) };
    mockTeamApiService = { getTeams: vi.fn().mockReturnValue(of(teams)) };
    mockLoadingService = { register: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CreatePlayerComponent],
      providers: [
        { provide: CountryApiService, useValue: mockCountryApiService },
        { provide: PlayerApiService, useValue: mockPlayerApiService },
        { provide: PlayerSeasonStatApiService, useValue: mockPlayerSeasonStatApiService },
        { provide: PositionApiService, useValue: mockPositionApiService },
        { provide: RouterService, useValue: mockRouterService },
        { provide: TeamApiService, useValue: mockTeamApiService },
        { provide: LoadingService, useValue: mockLoadingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
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
      component['onSubmit']();

      expect(component['form'].touched).toBe(true);
    });

    it('does not call createPlayer when form is invalid', () => {
      component['onSubmit']();

      expect(mockPlayerApiService.createPlayer).not.toHaveBeenCalled();
    });

    it('calls createPlayer with form value on valid submit', async () => {
      const player = fakePlayer();
      mockPlayerApiService.createPlayer.mockReturnValue(of(player));
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

      expect(mockPlayerApiService.createPlayer).toHaveBeenCalledWith({
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

    it('calls createPlayerSeasonStat with playerId and form positionId and teamId', async () => {
      const player = fakePlayer();
      mockPlayerApiService.createPlayer.mockReturnValue(of(player));
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

      expect(mockPlayerSeasonStatApiService.createPlayerSeasonStat).toHaveBeenCalledWith({
        playerId: player.id,
        positionId: positions[0].id,
        teamId: teams[0].id,
      });
    });

    it('defaults null country to country with id 1', async () => {
      component['form'].setValue({
        ...validFormValue,
        country: null,
        position: positions[0],
        team: teams[0],
      });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockPlayerApiService.createPlayer).toHaveBeenCalledWith(
        expect.objectContaining({ countryId: 1 }),
      );
    });

    it('defaults null fullName to undefined', async () => {
      component['form'].setValue({
        ...validFormValue,
        fullName: null,
        country: countries[0],
        position: positions[0],
        team: teams[0],
      });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      const called = mockPlayerApiService.createPlayer.mock.calls[0][0] as Record<string, unknown>;
      expect(called['fullName']).toBeUndefined();
    });

    it('defaults null statSourceId, premierLeagueId and height to 0', async () => {
      component['form'].setValue({
        ...validFormValue,
        statSourceId: null,
        premierLeagueId: null,
        height: null,
        country: countries[0],
        position: positions[0],
        team: teams[0],
      });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockPlayerApiService.createPlayer).toHaveBeenCalledWith(
        expect.objectContaining({ statSourceId: 0, premierLeagueId: 0, height: 0 }),
      );
    });

    it('navigates to player after both calls complete', async () => {
      const player = fakePlayer();
      const playerSeasonStat = fakePlayerSeasonStat();
      mockPlayerApiService.createPlayer.mockReturnValue(of(player));
      mockPlayerSeasonStatApiService.createPlayerSeasonStat.mockReturnValue(of(playerSeasonStat));
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

      expect(mockRouterService.navigateToPlayer).toHaveBeenCalledWith(playerSeasonStat.player.id);
    });
  });
});
