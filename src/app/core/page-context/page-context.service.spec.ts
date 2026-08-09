import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DestroyRef } from '@angular/core';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from './page-context.service';

describe('PageContextService', () => {
  const seasonName = 'Season 2025-2026';

  function setup(seasonOverride?: string) {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CurrentService,
          useValue: {
            season: signal(seasonOverride !== undefined ? { name: seasonOverride } : undefined),
          },
        },
      ],
    });
    return TestBed.inject(PageContextService);
  }

  function mockDestroyRef(): { destroyRef: DestroyRef; destroy: () => void } {
    const callbacks: (() => void)[] = [];
    const destroyRef = {
      onDestroy: (callback: () => void) => {
        callbacks.push(callback);
        return () => {};
      },
    } as unknown as DestroyRef;
    return { destroyRef, destroy: () => callbacks.forEach((fn) => fn()) };
  }

  it('defaults title to D11', () => {
    const service = setup();
    expect(service.title()).toBe('D11');
  });

  it('defaults subtitle to current season name', () => {
    const service = setup(seasonName);
    expect(service.subtitle()).toBe(seasonName);
  });

  it('defaults backgroundColor to undefined', () => {
    const service = setup();
    expect(service.backgroundColor()).toBeUndefined();
  });

  it('defaults textClass to undefined', () => {
    const service = setup();
    expect(service.textClass()).toBeUndefined();
  });

  it('reflects registered context title and subtitle', () => {
    const service = setup();
    const { destroyRef } = mockDestroyRef();

    service.register(destroyRef, {
      title: signal('Match Week 34'),
      subtitle: signal('Season 2025-2026'),
      backgroundColor: signal('#ff0000'),
    });

    expect(service.title()).toBe('Match Week 34');
    expect(service.subtitle()).toBe('Season 2025-2026');
    expect(service.backgroundColor()).toBe('#ff0000');
  });

  it('textClass returns text-white! for dark backgroundColor', () => {
    const service = setup();
    const { destroyRef } = mockDestroyRef();

    service.register(destroyRef, {
      title: signal('Title1'),
      backgroundColor: signal('#000000'),
    });

    expect(service.textClass()).toBe('text-white!');
  });

  it('textClass returns text-black! for light backgroundColor', () => {
    const service = setup();
    const { destroyRef } = mockDestroyRef();

    service.register(destroyRef, {
      title: signal('Title1'),
      backgroundColor: signal('#ffffff'),
    });

    expect(service.textClass()).toBe('text-black!');
  });

  it('resets to defaults after destroy', () => {
    const service = setup(seasonName);
    const { destroyRef, destroy } = mockDestroyRef();

    service.register(destroyRef, {
      title: signal('Match Week 34'),
      subtitle: signal('Custom subtitle'),
      backgroundColor: signal('#ff0000'),
    });

    destroy();

    expect(service.title()).toBe('D11');
    expect(service.subtitle()).toBe(seasonName);
    expect(service.backgroundColor()).toBeUndefined();
    expect(service.textClass()).toBeUndefined();
  });
});
