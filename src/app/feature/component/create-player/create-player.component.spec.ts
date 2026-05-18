import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { CountryApiService, Player, PlayerApiService } from '@app/core/api';
import { Country } from '@app/core/api/model/country.model';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeCountry, fakePlayer } from '@app/test';
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
};

describe('CreatePlayerComponent', () => {
  let fixture: ComponentFixture<CreatePlayerComponent>;
  let component: CreatePlayerComponent;
  let mockCountryApiService: { getCountries: ReturnType<typeof vi.fn> };
  let mockPlayerApiService: { createPlayer: ReturnType<typeof vi.fn> };
  let mockRouterService: { navigateToPlayer: ReturnType<typeof vi.fn> };
  let mockLoadingService: { register: ReturnType<typeof vi.fn> };
  let countries: Country[];

  beforeEach(async () => {
    vi.clearAllMocks();
    countries = [fakeCountry(), fakeCountry()];
    mockCountryApiService = { getCountries: vi.fn().mockReturnValue(of(countries)) };
    mockPlayerApiService = { createPlayer: vi.fn().mockReturnValue(of(fakePlayer())) };
    mockRouterService = { navigateToPlayer: vi.fn().mockResolvedValue(true) };
    mockLoadingService = { register: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CreatePlayerComponent],
      providers: [
        { provide: CountryApiService, useValue: mockCountryApiService },
        { provide: PlayerApiService, useValue: mockPlayerApiService },
        { provide: RouterService, useValue: mockRouterService },
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

  it('renders all form fields', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('#firstName')).toBeInTheDocument();
    expect(host.querySelector('#lastName')).toBeInTheDocument();
    expect(host.querySelector('#fullName')).toBeInTheDocument();
    expect(host.querySelector('#statSourceId')).toBeInTheDocument();
    expect(host.querySelector('#premierLeagueId')).toBeInTheDocument();
    expect(host.querySelector('#dateOfBirth')).toBeInTheDocument();
    expect(host.querySelector('#height')).toBeInTheDocument();
    expect(host.querySelector('#country')).toBeInTheDocument();
  });

  // isLoading -------------------------------------------------------------------------------------

  describe('isLoading', () => {
    it('is false initially', () => {
      expect(component['isLoading']()).toBe(false);
    });

    it('registers with LoadingService', () => {
      expect(mockLoadingService.register).toHaveBeenCalledWith(
        expect.anything(),
        component['isLoading'],
      );
    });

    it('is true while creating player and false after', async () => {
      const subject = new Subject<Player>();
      mockPlayerApiService.createPlayer.mockReturnValue(subject);
      component['form'].setValue({ ...validFormValue, country: countries[0] });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();

      expect(component['isLoading']()).toBe(true);

      subject.next(fakePlayer());
      subject.complete();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component['isLoading']()).toBe(false);
    });
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
      component['form'].setValue({ ...validFormValue, country: countries[0] });

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

    it('defaults null country to country with id 1', async () => {
      component['form'].setValue({ ...validFormValue, country: null });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockPlayerApiService.createPlayer).toHaveBeenCalledWith(
        expect.objectContaining({ countryId: 1 }),
      );
    });

    it('defaults null fullName to undefined', async () => {
      component['form'].setValue({ ...validFormValue, fullName: null, country: countries[0] });

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
      });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockPlayerApiService.createPlayer).toHaveBeenCalledWith(
        expect.objectContaining({ statSourceId: 0, premierLeagueId: 0, height: 0 }),
      );
    });

    it('navigates to player after successful create', async () => {
      const player = fakePlayer();
      mockPlayerApiService.createPlayer.mockReturnValue(of(player));

      component['form'].setValue({ ...validFormValue, country: countries[0] });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockRouterService.navigateToPlayer).toHaveBeenCalledWith(player.id);
    });
  });
});
