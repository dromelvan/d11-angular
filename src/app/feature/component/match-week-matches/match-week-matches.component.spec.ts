import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchBase, Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatchBase } from '@app/test';
import { beforeEach, describe, expect, vi } from 'vitest';
import { MatchWeekMatchesComponent } from './match-week-matches.component';

const mockRouterService = { navigateToMatch: vi.fn() };

function formatDateHeader(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

describe('MatchWeekMatchesComponent', () => {
  let fixture: ComponentFixture<MatchWeekMatchesComponent>;

  async function setup(groups: { date: string; matches: MatchBase[] }[]) {
    fixture = TestBed.createComponent(MatchWeekMatchesComponent);
    fixture.componentRef.setInput('groups', groups);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MatchWeekMatchesComponent],
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    }).compileComponents();
  });

  it('creates the component', async () => {
    await setup([]);
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Date header ----------------------------------------------------------------------------------

  describe('date header', () => {
    it('renders formatted date header for a group', async () => {
      const date = '2025-03-15';
      await setup([{ date, matches: [fakeMatchBase()] }]);

      expect(fixture.nativeElement.textContent).toContain(formatDateHeader(date));
    });

    it('renders Postponed header when group date is POSTPONED status', async () => {
      await setup([{ date: Status.POSTPONED, matches: [fakeMatchBase()] }]);

      expect(fixture.nativeElement.textContent).toContain('Postponed');
    });

    it('renders headers for all groups', async () => {
      const date1 = '2025-03-15';
      const date2 = '2025-03-16';
      await setup([
        { date: date1, matches: [fakeMatchBase()] },
        { date: date2, matches: [fakeMatchBase()] },
      ]);

      expect(fixture.nativeElement.textContent).toContain(formatDateHeader(date1));
      expect(fixture.nativeElement.textContent).toContain(formatDateHeader(date2));
    });
  });

  // Match rows -----------------------------------------------------------------------------------

  describe('match rows', () => {
    it('renders a match result col for each match in a group', async () => {
      const matches = [fakeMatchBase(), fakeMatchBase()];
      await setup([{ date: '2025-03-15', matches }]);

      expect(fixture.nativeElement.querySelectorAll('app-match-result-col').length).toBe(2);
    });

    it('renders match result cols across multiple groups', async () => {
      await setup([
        { date: '2025-03-15', matches: [fakeMatchBase(), fakeMatchBase()] },
        { date: '2025-03-16', matches: [fakeMatchBase()] },
      ]);

      expect(fixture.nativeElement.querySelectorAll('app-match-result-col').length).toBe(3);
    });
  });

  // Separators -----------------------------------------------------------------------------------

  describe('separators', () => {
    it('renders a separator between each non-last match in a group', async () => {
      await setup([
        { date: '2025-03-15', matches: [fakeMatchBase(), fakeMatchBase(), fakeMatchBase()] },
      ]);

      expect(fixture.nativeElement.querySelectorAll('.app-separator').length).toBe(2);
    });

    it('does not render a separator after the last match in a group', async () => {
      await setup([{ date: '2025-03-15', matches: [fakeMatchBase()] }]);

      expect(fixture.nativeElement.querySelectorAll('.app-separator').length).toBe(0);
    });
  });
});
