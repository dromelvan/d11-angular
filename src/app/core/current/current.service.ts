import { computed, inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  CurrentApiService,
  MatchWeekBase,
  SeasonBase,
  TransferDay,
  TransferWindowBase,
} from '@app/core/api';
import { LocalStorageCachedObservable } from '@app/core/api/local-storage-cache';
import { Current } from '@app/core/api/model/current.model';

function timeToLive(): number {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setHours(3, 0, 0, 0);
  if (now >= cutoff) {
    cutoff.setDate(cutoff.getDate() + 1);
  }
  return cutoff.getTime() - now.getTime();
}

@Injectable({
  providedIn: 'root',
})
export class CurrentService {
  readonly rxCurrent = rxResource<Current, void>({
    stream: () => this.currentCache.get(),
  });

  readonly season = computed<SeasonBase | undefined>(() => this.rxCurrent.value()?.season);
  readonly matchWeek = computed<MatchWeekBase | undefined>(() => this.rxCurrent.value()?.matchWeek);
  readonly transferWindow = computed<TransferWindowBase | undefined>(
    () => this.rxCurrent.value()?.transferWindow,
  );
  readonly transferDay = computed<TransferDay | undefined>(
    () => this.rxCurrent.value()?.transferDay,
  );

  private readonly currentApiService = inject(CurrentApiService);

  private readonly currentCache = new LocalStorageCachedObservable<Current>(
    'current',
    () => this.currentApiService.getCurrent(),
    () => timeToLive(),
  );
}
