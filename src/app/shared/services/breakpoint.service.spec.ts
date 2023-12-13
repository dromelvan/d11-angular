import { TestBed } from '@angular/core/testing';
import { BreakpointService } from './breakpoint.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { of } from 'rxjs';

describe('BreakpointService', () => {
  let service: BreakpointService;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('BreakpointObserver', ['observe']);

    TestBed.configureTestingModule({
      providers: [
        BreakpointService,
        { provide: BreakpointObserver, useValue: spy },
      ],
    });

    breakpointObserverSpy = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    breakpointObserverSpy.observe.and.returnValue(of<BreakpointState>({
      breakpoints: {},
      matches: false,
    }));

    service = TestBed.inject(BreakpointService);
  });

  it('should handle xs screen size', () => {
    const observeSubject = of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: true,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: false,
        [Breakpoints.XLarge]: false,
      },
      matches: true,
    });

    breakpointObserverSpy.observe.and.returnValue(observeSubject);

    service['observeScreenSize']();

    expect(service.isXs()).toBe(true);
    expect(service.isSm()).toBe(false);
    expect(service.isSmAndDown()).toBe(true);
    expect(service.isSmAndUp()).toBe(false);
    expect(service.isMd()).toBe(false);
    expect(service.isMdAndDown()).toBe(true);
    expect(service.isMdAndUp()).toBe(false);
    expect(service.isLg()).toBe(false);
    expect(service.isLgAndDown()).toBe(true);
    expect(service.isLgAndUp()).toBe(false);
    expect(service.isXl()).toBe(false);
  });

  it('should handle sm screen size', () => {
    const observeSubject = of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: true,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: false,
        [Breakpoints.XLarge]: false,
      },
      matches: true,
    });

    breakpointObserverSpy.observe.and.returnValue(observeSubject);

    service['observeScreenSize']();

    expect(service.isXs()).toBe(false);
    expect(service.isSm()).toBe(true);
    expect(service.isSmAndDown()).toBe(true);
    expect(service.isSmAndUp()).toBe(true);
    expect(service.isMd()).toBe(false);
    expect(service.isMdAndDown()).toBe(true);
    expect(service.isMdAndUp()).toBe(false);
    expect(service.isLg()).toBe(false);
    expect(service.isLgAndDown()).toBe(true);
    expect(service.isLgAndUp()).toBe(false);
    expect(service.isXl()).toBe(false);
  });

  it('should handle md screen size', () => {
    const observeSubject = of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: true,
        [Breakpoints.Large]: false,
        [Breakpoints.XLarge]: false,
      },
      matches: true,
    });

    breakpointObserverSpy.observe.and.returnValue(observeSubject);

    service['observeScreenSize']();

    expect(service.isXs()).toBe(false);
    expect(service.isSm()).toBe(false);
    expect(service.isSmAndDown()).toBe(false);
    expect(service.isSmAndUp()).toBe(true);
    expect(service.isMd()).toBe(true);
    expect(service.isMdAndDown()).toBe(true);
    expect(service.isMdAndUp()).toBe(true);
    expect(service.isLg()).toBe(false);
    expect(service.isLgAndDown()).toBe(true);
    expect(service.isLgAndUp()).toBe(false);
    expect(service.isXl()).toBe(false);
  });

  it('should handle lg screen size', () => {
    const observeSubject = of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: true,
        [Breakpoints.XLarge]: false,
      },
      matches: true,
    });

    breakpointObserverSpy.observe.and.returnValue(observeSubject);

    service['observeScreenSize']();

    expect(service.isXs()).toBe(false);
    expect(service.isSm()).toBe(false);
    expect(service.isSmAndDown()).toBe(false);
    expect(service.isSmAndUp()).toBe(true);
    expect(service.isMd()).toBe(false);
    expect(service.isMdAndDown()).toBe(false);
    expect(service.isMdAndUp()).toBe(true);
    expect(service.isLg()).toBe(true);
    expect(service.isLgAndDown()).toBe(true);
    expect(service.isLgAndUp()).toBe(true);
    expect(service.isXl()).toBe(false);
  });

  it('should handle xl screen size', () => {
    const observeSubject = of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: false,
        [Breakpoints.XLarge]: true,
      },
      matches: true,
    });

    breakpointObserverSpy.observe.and.returnValue(observeSubject);

    service['observeScreenSize']();

    expect(service.isXs()).toBe(false);
    expect(service.isSm()).toBe(false);
    expect(service.isSmAndDown()).toBe(false);
    expect(service.isSmAndUp()).toBe(true);
    expect(service.isMd()).toBe(false);
    expect(service.isMdAndDown()).toBe(false);
    expect(service.isMdAndUp()).toBe(true);
    expect(service.isLg()).toBe(false);
    expect(service.isLgAndDown()).toBe(false);
    expect(service.isLgAndUp()).toBe(true);
    expect(service.isXl()).toBe(true);
  });

});