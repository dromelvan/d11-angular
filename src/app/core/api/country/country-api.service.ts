import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '@app/core/api/api.service';
import { Country } from '@app/core/api/model/country.model';
import { CountriesResponseBody } from './countries-response-body.model';

@Injectable({ providedIn: 'root' })
export class CountryApiService {
  readonly namespace = 'countries';
  private apiService = inject(ApiService);

  getCountries(): Observable<Country[]> {
    return this.apiService
      .get<CountriesResponseBody>({ namespace: this.namespace })
      .pipe(map((result) => result.countries));
  }
}
