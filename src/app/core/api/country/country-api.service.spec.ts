import { TestBed } from '@angular/core/testing';
import { ApiService } from '@app/core/api/api.service';
import { Country } from '@app/core/api/model/country.model';
import { fakeCountry, GetFn } from '@app/test';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe } from 'vitest';
import { CountryApiService } from './country-api.service';
import { CountriesResponseBody } from './countries-response-body.model';

describe('CountryApiService', () => {
  let countryApi: CountryApiService;
  let apiServiceMock: { get: GetFn };

  beforeEach(() => {
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

    it('propagates errors', async () => {
      const error = new Error('INTERNAL_SERVER_ERROR');
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => error)) as GetFn;

      await expect(firstValueFrom(countryApi.getCountries())).rejects.toThrow(error.message);
    });

    it('does not map the result on error', async () => {
      apiServiceMock.get = vi.fn().mockReturnValue(throwError(() => new Error())) as GetFn;

      await expect(firstValueFrom(countryApi.getCountries())).rejects.toBeInstanceOf(Error);
    });
  });
});
