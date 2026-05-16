import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { LocalStorageCachedObservable } from '@app/core/api/local-storage-cache';
import { Country } from '@app/core/api/model/country.model';
import { CountriesResponseBody } from './countries-response-body.model';

@Injectable({ providedIn: 'root' })
export class CountryApiService {
  readonly namespace = 'countries';

  private apiService = inject(ApiService);
  private countriesCache = new LocalStorageCachedObservable<Country[]>(
    'countries',
    () =>
      this.apiService
        .get<CountriesResponseBody>({ namespace: this.namespace })
        .pipe(map((result) => result.countries)),
    30 * 24 * 60 * 60 * 1000,
  );

  getCountries(): Observable<Country[]> {
    return this.countriesCache.get();
  }
}
