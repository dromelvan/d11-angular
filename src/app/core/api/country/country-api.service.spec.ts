import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { Country } from '@app/core/api/model/country.model';
import { fakeCountry, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { CountryApiService } from './country-api.service';
import { CountriesResponseBody } from './countries-response-body.model';

const STORAGE_KEY = 'd11:countries';
const TTL_30_DAYS = 30 * 24 * 60 * 60 * 1000;

describe('CountryApiService', () => {
  let countryApi: CountryApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [CountryApiService, { provide: ApiService, useValue: { get: vi.fn() as GetFn } }],
    });

    countryApi = TestBed.inject(CountryApiService);
    apiServiceMock = TestBed.inject(ApiService) as { get: GetFn };
  });

  it('is created', () => {
    expect(countryApi).toBeTruthy();
  });

  // getCountries ---------------------------------------------------------------------------------

  describe('getCountries', () => {
    const countries: Country[] = [fakeCountry(), fakeCountry()];
    const response: CountriesResponseBody = { countries };

    it('calls get with namespace', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(countryApi.getCountries());

      expect(apiServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ namespace: countryApi.namespace }),
      );
    });

    it('maps the result', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(countryApi.getCountries());

      expect(result).toEqual(countries);
    });

    it('does not call the API on subsequent calls', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(countryApi.getCountries());
      await firstValueFrom(countryApi.getCountries());

      expect(apiServiceMock.get).toHaveBeenCalledOnce();
    });

    it('stores result in localStorage after API call', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(countryApi.getCountries());

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.value).toEqual(countries);
      expect(stored.expiry).toBeGreaterThan(Date.now());
    });

    it('stores result with 30 day expiry', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;
      const before = Date.now();

      await firstValueFrom(countryApi.getCountries());

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.expiry).toBeGreaterThanOrEqual(before + TTL_30_DAYS);
    });

    it('returns cached data from localStorage without calling API', async () => {
      const cachedCountries = [fakeCountry(), fakeCountry()];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value: cachedCountries, expiry: Date.now() + TTL_30_DAYS }),
      );
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      const result = await firstValueFrom(countryApi.getCountries());

      expect(result).toEqual(cachedCountries);
      expect(apiServiceMock.get).not.toHaveBeenCalled();
    });

    it('calls API when cached data is expired', async () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value: [fakeCountry()], expiry: Date.now() - 1 }),
      );
      apiServiceMock.get = vi.fn().mockReturnValue(of(response)) as GetFn;

      await firstValueFrom(countryApi.getCountries());

      expect(apiServiceMock.get).toHaveBeenCalledOnce();
    });

    it('propagates errors', async () => {
      const error = new Error('INTERNAL_SERVER_ERROR');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => error)) as GetFn;

      await expect(firstValueFrom(countryApi.getCountries())).rejects.toThrow(error.message);
    });
  });
});
