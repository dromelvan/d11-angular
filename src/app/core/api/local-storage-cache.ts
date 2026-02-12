import { defer, Observable, of } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

export class LocalStorageCachedObservable<T> {
  private stream$?: Observable<T>;
  private readonly prefixedStorageKey: string;

  constructor(
    private readonly storageKey: string,
    private readonly sourceFactory: () => Observable<T>,
    private readonly timeToLive?: number,
  ) {
    this.prefixedStorageKey = `d11:${this.storageKey}`;
  }

  get(): Observable<T> {
    if (!this.stream$) {
      this.stream$ = defer(() => {
        const stored = localStorage.getItem(this.prefixedStorageKey);

        if (stored) {
          try {
            const parsed = JSON.parse(stored) as {
              value: T;
              expiry?: number;
            };

            if (!this.timeToLive || !parsed.expiry || Date.now() < parsed.expiry) {
              return of(parsed.value);
            }
            localStorage.removeItem(this.prefixedStorageKey);
          } catch {
            localStorage.removeItem(this.prefixedStorageKey);
          }
        }

        return this.sourceFactory().pipe(
          tap((value) => {
            const payload =
              this.timeToLive != null
                ? {
                    value,
                    expiry: Date.now() + this.timeToLive,
                  }
                : { value };

            try {
              localStorage.setItem(this.prefixedStorageKey, JSON.stringify(payload));
            } catch (error) {
              if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.warn('localStorage quota exceeded, cache not saved');
              }
            }
          }),
        );
      }).pipe(
        shareReplay({
          bufferSize: 1,
          refCount: false,
        }),
      );
    }

    return this.stream$;
  }

  clear(): void {
    this.stream$ = undefined;
    localStorage.removeItem(this.prefixedStorageKey);
  }
}
