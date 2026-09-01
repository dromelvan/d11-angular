import { inject, Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export const Breakpoint = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
} as const;

function breakpointSignal(query: string) {
  const observer = inject(BreakpointObserver);
  return toSignal(observer.observe(query).pipe(map((result) => result.matches)), {
    initialValue: observer.isMatched(query),
  });
}

@Injectable({ providedIn: 'root' })
export class BreakpointService {
  readonly isSmOrUp = breakpointSignal(Breakpoint.sm);
  readonly isMdOrUp = breakpointSignal(Breakpoint.md);
  readonly isLgOrUp = breakpointSignal(Breakpoint.lg);
  readonly isXlOrUp = breakpointSignal(Breakpoint.xl);
  readonly is2xlOrUp = breakpointSignal(Breakpoint['2xl']);
}
