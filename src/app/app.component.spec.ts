import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { BreakpointService } from './shared/services/breakpoint.service';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let service: BreakpointService;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('BreakpointObserver', ['observe']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        MockSidenavComponent,
        MockToolBarMdAndUpdComponent,
        MockToolBarSmAndDownComponent
      ],
      providers: [
        BreakpointService,
        { provide: BreakpointObserver, useValue: spy },
      ],
    });

    breakpointObserverSpy = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    breakpointObserverSpy.observe.and.returnValue(of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: true,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: false,
        [Breakpoints.XLarge]: false,
      },
      matches: true,
    }));

    service = TestBed.inject(BreakpointService);

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'D11'`, () => {
    expect(component.title).toEqual('D11');
  });

  it('should detect breakpoint changes', () => {
    const breakpointContainer = fixture.debugElement.query(By.css('.breakpoint-container'));
    expect(breakpointContainer).toBeTruthy();

    breakpointObserverSpy.observe.and.returnValue(of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: true,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: false,
        [Breakpoints.XLarge]: false,
      },
      matches: true,
    }));
    service['observeScreenSize']();
    fixture.detectChanges();

    expect(breakpointContainer.nativeElement.classList).toContain('breakpoint-xs');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-sm');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-md');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-lg');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-xl');
    expect(fixture.debugElement.query(By.directive(MockSidenavComponent))).toBeTruthy();

    breakpointObserverSpy.observe.and.returnValue(of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: true,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: false,
        [Breakpoints.XLarge]: false,
      },
      matches: true,
    }));
    service['observeScreenSize']();
    fixture.detectChanges();

    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-xs');
    expect(breakpointContainer.nativeElement.classList).toContain('breakpoint-sm');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-md');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-lg');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-xl');
    expect(fixture.debugElement.query(By.directive(MockSidenavComponent))).toBeTruthy();

    breakpointObserverSpy.observe.and.returnValue(of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: true,
        [Breakpoints.Large]: false,
        [Breakpoints.XLarge]: false,
      },
      matches: true,
    }));
    service['observeScreenSize']();
    fixture.detectChanges();

    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-xs');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-sm');
    expect(breakpointContainer.nativeElement.classList).toContain('breakpoint-md');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-lg');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-xl');
    expect(fixture.debugElement.query(By.directive(MockSidenavComponent))).not.toBeTruthy();

    breakpointObserverSpy.observe.and.returnValue(of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: true,
        [Breakpoints.XLarge]: false,
      },
      matches: true,
    }));
    service['observeScreenSize']();
    fixture.detectChanges();

    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-xs');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-sm');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-md');
    expect(breakpointContainer.nativeElement.classList).toContain('breakpoint-lg');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-xl');
    expect(fixture.debugElement.query(By.directive(MockSidenavComponent))).not.toBeTruthy();

    breakpointObserverSpy.observe.and.returnValue(of<BreakpointState>({
      breakpoints: {
        [Breakpoints.XSmall]: false,
        [Breakpoints.Small]: false,
        [Breakpoints.Medium]: false,
        [Breakpoints.Large]: false,
        [Breakpoints.XLarge]: true,
      },
      matches: true,
    }));
    service['observeScreenSize']();
    fixture.detectChanges();

    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-xs');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-sm');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-md');
    expect(breakpointContainer.nativeElement.classList).not.toContain('breakpoint-lg');
    expect(breakpointContainer.nativeElement.classList).toContain('breakpoint-xl');
    expect(fixture.debugElement.query(By.directive(MockSidenavComponent))).not.toBeTruthy();

  });

});

@Component({
  selector: 'app-sidenav',
  template: ''
})
class MockSidenavComponent {
}

@Component({
  selector: 'app-toolbar-md-and-up',
  template: ''
})
class MockToolBarMdAndUpdComponent {
}

@Component({
  selector: 'app-toolbar-sm-and-down',
  template: ''
})
class MockToolBarSmAndDownComponent {
}