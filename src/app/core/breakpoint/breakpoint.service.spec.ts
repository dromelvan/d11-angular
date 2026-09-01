import { TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { Breakpoint, BreakpointService } from './breakpoint.service';

function setup(initialMatches: boolean) {
  const breakpointChanges$ = new Subject<BreakpointState>();
  const mockBreakpointObserver = {
    observe: vi.fn().mockReturnValue(breakpointChanges$.asObservable()),
    isMatched: vi.fn().mockReturnValue(initialMatches),
  };

  TestBed.configureTestingModule({
    providers: [{ provide: BreakpointObserver, useValue: mockBreakpointObserver }],
  });

  const service = TestBed.inject(BreakpointService);
  return { service, breakpointChanges$, mockBreakpointObserver };
}

describe('Breakpoint constants', () => {
  it('defines the correct media query for each Tailwind breakpoint', () => {
    expect(Breakpoint.sm).toBe('(min-width: 640px)');
    expect(Breakpoint.md).toBe('(min-width: 768px)');
    expect(Breakpoint.lg).toBe('(min-width: 1024px)');
    expect(Breakpoint.xl).toBe('(min-width: 1280px)');
    expect(Breakpoint['2xl']).toBe('(min-width: 1536px)');
  });
});

describe('BreakpointService', () => {
  describe('isSmOrUp', () => {
    it('observes the sm breakpoint query', () => {
      const { mockBreakpointObserver } = setup(false);
      expect(mockBreakpointObserver.observe).toHaveBeenCalledWith(Breakpoint.sm);
      expect(mockBreakpointObserver.isMatched).toHaveBeenCalledWith(Breakpoint.sm);
    });

    it('reflects initial match state when below sm', () => {
      const { service } = setup(false);
      expect(service.isSmOrUp()).toBe(false);
    });

    it('reflects initial match state when at or above sm', () => {
      const { service } = setup(true);
      expect(service.isSmOrUp()).toBe(true);
    });

    it('updates when breakpoint is crossed upward', () => {
      const { service, breakpointChanges$ } = setup(false);

      breakpointChanges$.next({ matches: true, breakpoints: {} });
      TestBed.tick();

      expect(service.isSmOrUp()).toBe(true);
    });

    it('updates when breakpoint is crossed downward', () => {
      const { service, breakpointChanges$ } = setup(true);

      breakpointChanges$.next({ matches: false, breakpoints: {} });
      TestBed.tick();

      expect(service.isSmOrUp()).toBe(false);
    });
  });

  describe('isMdOrUp', () => {
    it('observes the md breakpoint query', () => {
      const { mockBreakpointObserver } = setup(false);
      expect(mockBreakpointObserver.observe).toHaveBeenCalledWith(Breakpoint.md);
      expect(mockBreakpointObserver.isMatched).toHaveBeenCalledWith(Breakpoint.md);
    });

    it('reflects initial match state when below md', () => {
      const { service } = setup(false);
      expect(service.isMdOrUp()).toBe(false);
    });

    it('reflects initial match state when at or above md', () => {
      const { service } = setup(true);
      expect(service.isMdOrUp()).toBe(true);
    });
  });

  describe('isLgOrUp', () => {
    it('observes the lg breakpoint query', () => {
      const { mockBreakpointObserver } = setup(false);
      expect(mockBreakpointObserver.observe).toHaveBeenCalledWith(Breakpoint.lg);
      expect(mockBreakpointObserver.isMatched).toHaveBeenCalledWith(Breakpoint.lg);
    });

    it('reflects initial match state when below lg', () => {
      const { service } = setup(false);
      expect(service.isLgOrUp()).toBe(false);
    });

    it('reflects initial match state when at or above lg', () => {
      const { service } = setup(true);
      expect(service.isLgOrUp()).toBe(true);
    });
  });

  describe('isXlOrUp', () => {
    it('observes the xl breakpoint query', () => {
      const { mockBreakpointObserver } = setup(false);
      expect(mockBreakpointObserver.observe).toHaveBeenCalledWith(Breakpoint.xl);
      expect(mockBreakpointObserver.isMatched).toHaveBeenCalledWith(Breakpoint.xl);
    });

    it('reflects initial match state when below xl', () => {
      const { service } = setup(false);
      expect(service.isXlOrUp()).toBe(false);
    });

    it('reflects initial match state when at or above xl', () => {
      const { service } = setup(true);
      expect(service.isXlOrUp()).toBe(true);
    });
  });

  describe('is2xlOrUp', () => {
    it('observes the 2xl breakpoint query', () => {
      const { mockBreakpointObserver } = setup(false);
      expect(mockBreakpointObserver.observe).toHaveBeenCalledWith(Breakpoint['2xl']);
      expect(mockBreakpointObserver.isMatched).toHaveBeenCalledWith(Breakpoint['2xl']);
    });

    it('reflects initial match state when below 2xl', () => {
      const { service } = setup(false);
      expect(service.is2xlOrUp()).toBe(false);
    });

    it('reflects initial match state when at or above 2xl', () => {
      const { service } = setup(true);
      expect(service.is2xlOrUp()).toBe(true);
    });
  });
});
