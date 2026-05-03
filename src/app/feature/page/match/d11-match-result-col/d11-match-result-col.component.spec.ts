import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11MatchBase, Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeD11MatchBase, fakeD11TeamBase } from '@app/test';
import { beforeEach, describe, expect, vi } from 'vitest';
import { D11MatchResultColComponent } from './d11-match-result-col.component';

const mockRouterService = { navigateToD11Match: vi.fn() };

describe('D11MatchResultColComponent', () => {
  let fixture: ComponentFixture<D11MatchResultColComponent>;

  async function setup(d11MatchInput: D11MatchBase = fakeD11MatchBase(), isLast = true) {
    fixture = TestBed.createComponent(D11MatchResultColComponent);
    fixture.componentRef.setInput('d11Match', d11MatchInput);
    fixture.componentRef.setInput('isLast', isLast);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [D11MatchResultColComponent],
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    }).compileComponents();
  });

  it('creates the component', async () => {
    await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Navigation -----------------------------------------------------------------------------------

  it('navigates to d11 match on click', async () => {
    const match = fakeD11MatchBase();
    await setup(match);

    fixture.nativeElement.click();
    expect(mockRouterService.navigateToD11Match).toHaveBeenCalledExactlyOnceWith(match.id);
  });

  // Separator ------------------------------------------------------------------------------------

  describe('separator', () => {
    it('has app-grid-separator class when isLast is false', async () => {
      await setup(fakeD11MatchBase(), false);
      expect(fixture.nativeElement.classList).toContain('app-grid-separator');
    });

    it('does not have app-grid-separator class when isLast is true', async () => {
      await setup(fakeD11MatchBase(), true);
      expect(fixture.nativeElement.classList).not.toContain('app-grid-separator');
    });
  });

  // Team names -----------------------------------------------------------------------------------

  describe('team names', () => {
    it('renders home team name', async () => {
      const homeD11Team = { ...fakeD11TeamBase(), name: 'Team1' };
      await setup({ ...fakeD11MatchBase(), homeD11Team });

      expect(fixture.nativeElement.textContent).toContain('Team1');
    });

    it('renders away team name', async () => {
      const awayD11Team = { ...fakeD11TeamBase(), name: 'Team2' };
      await setup({ ...fakeD11MatchBase(), awayD11Team });

      expect(fixture.nativeElement.textContent).toContain('Team2');
    });
  });

  // Kickoff time ---------------------------------------------------------------------------------

  describe('kickoff time', () => {
    it('renders in HH:mm format', async () => {
      const datetime = '2025-06-15T14:30:00.000Z';
      await setup({ ...fakeD11MatchBase(), status: Status.PENDING, datetime });

      const date = new Date(datetime);
      const expected = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      expect(fixture.nativeElement.textContent).toContain(expected);
    });
  });

  // Elapsed time ---------------------------------------------------------------------------------

  describe('elapsed time', () => {
    it('renders for active match', async () => {
      await setup({ ...fakeD11MatchBase(), status: Status.ACTIVE, elapsed: '45' });

      expect(fixture.nativeElement.textContent).toContain('45');
    });

    it('renders for full time match', async () => {
      await setup({ ...fakeD11MatchBase(), status: Status.FULL_TIME, elapsed: 'FT' });

      expect(fixture.nativeElement.textContent).toContain('FT');
    });

    it('renders for finished match', async () => {
      await setup({ ...fakeD11MatchBase(), status: Status.FINISHED, elapsed: 'FT' });

      expect(fixture.nativeElement.textContent).toContain('FT');
    });

    it('does not render for pending match', async () => {
      await setup({ ...fakeD11MatchBase(), status: Status.PENDING, elapsed: 'N/A' });

      expect(fixture.nativeElement.textContent).not.toContain('N/A');
    });

    describe('full time indicator', () => {
      it('renders * when status is FULL_TIME', async () => {
        await setup({ ...fakeD11MatchBase(), status: Status.FULL_TIME });

        const errorSpan = fixture.nativeElement.querySelector('span.text-error');
        expect(errorSpan).toBeTruthy();
        expect(errorSpan.textContent.trim()).toBe('*');
      });

      it('does not render * when status is ACTIVE', async () => {
        await setup({ ...fakeD11MatchBase(), status: Status.ACTIVE });

        expect(fixture.nativeElement.querySelector('span.text-error')).toBeNull();
      });

      it('does not render * when status is FINISHED', async () => {
        await setup({ ...fakeD11MatchBase(), status: Status.FINISHED });

        expect(fixture.nativeElement.querySelector('span.text-error')).toBeNull();
      });
    });

    describe('active match elapsed styling', () => {
      it('elapsed span has bg-primary class when status is ACTIVE', async () => {
        await setup({ ...fakeD11MatchBase(), status: Status.ACTIVE, elapsed: '45' });

        const elapsedSpan = Array.from<HTMLElement>(
          fixture.nativeElement.querySelectorAll('span'),
        ).find((span) => span.textContent?.trim().startsWith('45'));
        expect(elapsedSpan?.classList).toContain('bg-primary');
      });

      it('elapsed span does not have bg-primary class when status is FULL_TIME', async () => {
        await setup({ ...fakeD11MatchBase(), status: Status.FULL_TIME, elapsed: 'FT' });

        const elapsedSpan = Array.from<HTMLElement>(
          fixture.nativeElement.querySelectorAll('span'),
        ).find((span) => span.textContent?.trim().startsWith('FT'));
        expect(elapsedSpan?.classList).not.toContain('bg-primary');
      });

      it('elapsed span does not have bg-primary class when status is FINISHED', async () => {
        await setup({ ...fakeD11MatchBase(), status: Status.FINISHED, elapsed: 'FT' });

        const elapsedSpan = Array.from<HTMLElement>(
          fixture.nativeElement.querySelectorAll('span'),
        ).find((span) => span.textContent?.trim().startsWith('FT'));
        expect(elapsedSpan?.classList).not.toContain('bg-primary');
      });
    });
  });

  // Goals ----------------------------------------------------------------------------------------

  describe('goals', () => {
    it('renders for active match', async () => {
      await setup({
        ...fakeD11MatchBase(),
        status: Status.ACTIVE,
        homeTeamGoalsScored: 101,
        awayTeamGoalsScored: 103,
      });

      expect(fixture.nativeElement.textContent).toContain('101');
      expect(fixture.nativeElement.textContent).toContain('103');
    });

    it('renders for full time match', async () => {
      await setup({
        ...fakeD11MatchBase(),
        status: Status.FULL_TIME,
        homeTeamGoalsScored: 101,
        awayTeamGoalsScored: 103,
      });

      expect(fixture.nativeElement.textContent).toContain('101');
      expect(fixture.nativeElement.textContent).toContain('103');
    });

    it('renders for finished match', async () => {
      await setup({
        ...fakeD11MatchBase(),
        status: Status.FINISHED,
        homeTeamGoalsScored: 101,
        awayTeamGoalsScored: 103,
      });

      expect(fixture.nativeElement.textContent).toContain('101');
      expect(fixture.nativeElement.textContent).toContain('103');
    });

    it('does not render for pending match', async () => {
      await setup({
        ...fakeD11MatchBase(),
        status: Status.PENDING,
        homeTeamGoalsScored: 101,
        awayTeamGoalsScored: 103,
      });

      expect(fixture.nativeElement.textContent).not.toContain('101');
      expect(fixture.nativeElement.textContent).not.toContain('103');
    });

    it('does not render for postponed match', async () => {
      await setup({
        ...fakeD11MatchBase(),
        status: Status.POSTPONED,
        homeTeamGoalsScored: 101,
        awayTeamGoalsScored: 103,
      });

      expect(fixture.nativeElement.textContent).not.toContain('101');
      expect(fixture.nativeElement.textContent).not.toContain('103');
    });

    describe('goal change indicator', () => {
      it('shows +N G and up arrow when home goals increased', async () => {
        await setup({
          ...fakeD11MatchBase(),
          status: Status.ACTIVE,
          homeTeamGoalsScored: 3,
          previousHomeTeamGoalsScored: 1,
          awayTeamGoalsScored: 0,
          previousAwayTeamGoalsScored: 0,
        });

        expect(fixture.nativeElement.querySelector('app-icon.text-success')).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('+2 G');
      });

      it('shows -N G and down arrow when home goals decreased', async () => {
        await setup({
          ...fakeD11MatchBase(),
          status: Status.ACTIVE,
          homeTeamGoalsScored: 1,
          previousHomeTeamGoalsScored: 2,
          awayTeamGoalsScored: 0,
          previousAwayTeamGoalsScored: 0,
        });

        expect(fixture.nativeElement.querySelector('app-icon.text-error')).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('-1 G');
      });

      it('does not show indicator when goals are unchanged', async () => {
        await setup({
          ...fakeD11MatchBase(),
          status: Status.ACTIVE,
          homeTeamGoalsScored: 2,
          previousHomeTeamGoalsScored: 2,
          awayTeamGoalsScored: 2,
          previousAwayTeamGoalsScored: 2,
        });

        expect(fixture.nativeElement.querySelector('app-icon')).toBeNull();
      });

      it('shows +N G and up arrow when away goals increased', async () => {
        await setup({
          ...fakeD11MatchBase(),
          status: Status.ACTIVE,
          homeTeamGoalsScored: 0,
          previousHomeTeamGoalsScored: 0,
          awayTeamGoalsScored: 2,
          previousAwayTeamGoalsScored: 1,
        });

        expect(fixture.nativeElement.querySelector('app-icon.text-success')).toBeTruthy();
        expect(fixture.nativeElement.textContent).toContain('+1 G');
      });

      it('does not show indicator when status is PENDING even if goals differ', async () => {
        await setup({
          ...fakeD11MatchBase(),
          status: Status.PENDING,
          homeTeamGoalsScored: 3,
          previousHomeTeamGoalsScored: 1,
          awayTeamGoalsScored: 3,
          previousAwayTeamGoalsScored: 1,
        });

        expect(fixture.nativeElement.querySelector('app-icon')).toBeNull();
      });
    });
  });

  // Points ---------------------------------------------------------------------------------------

  describe('points', () => {
    it('renders home and away team points for active match', async () => {
      await setup({
        ...fakeD11MatchBase(),
        status: Status.ACTIVE,
        homeTeamPoints: 101,
        awayTeamPoints: 103,
      });

      expect(fixture.nativeElement.textContent).toContain('(101)');
      expect(fixture.nativeElement.textContent).toContain('(103)');
    });

    it('renders home and away team points for finished match', async () => {
      await setup({
        ...fakeD11MatchBase(),
        status: Status.FINISHED,
        homeTeamPoints: 101,
        awayTeamPoints: 103,
      });

      expect(fixture.nativeElement.textContent).toContain('(101)');
      expect(fixture.nativeElement.textContent).toContain('(103)');
    });

    it('does not render points for pending match', async () => {
      await setup({
        ...fakeD11MatchBase(),
        status: Status.PENDING,
        homeTeamPoints: 101,
        awayTeamPoints: 103,
      });

      expect(fixture.nativeElement.textContent).not.toContain('(101)');
      expect(fixture.nativeElement.textContent).not.toContain('(103)');
    });

    it('does not render points for postponed match', async () => {
      await setup({
        ...fakeD11MatchBase(),
        status: Status.POSTPONED,
        homeTeamPoints: 101,
        awayTeamPoints: 103,
      });

      expect(fixture.nativeElement.textContent).not.toContain('(101)');
      expect(fixture.nativeElement.textContent).not.toContain('(103)');
    });
  });
});
