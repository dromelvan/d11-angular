import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Status } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeMatchBase, fakeTeamBase } from '@app/test';
import { beforeEach, describe, expect, vi } from 'vitest';
import { MatchResultColComponent } from './match-result-col.component';

const mockRouterService = { navigateToMatch: vi.fn() };

describe('MatchResultColComponent', () => {
  let fixture: ComponentFixture<MatchResultColComponent>;

  async function setup(matchInput = fakeMatchBase(), isLast = true, showDate = false) {
    fixture = TestBed.createComponent(MatchResultColComponent);
    fixture.componentRef.setInput('match', matchInput);
    fixture.componentRef.setInput('isLast', isLast);
    fixture.componentRef.setInput('showDate', showDate);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MatchResultColComponent],
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    }).compileComponents();
  });

  it('creates the component', async () => {
    await setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Navigation -----------------------------------------------------------------------------------

  it('navigates to match on click', async () => {
    const match = fakeMatchBase();
    await setup(match);

    fixture.nativeElement.click();
    expect(mockRouterService.navigateToMatch).toHaveBeenCalledExactlyOnceWith(match.id);
  });

  // Separator ------------------------------------------------------------------------------------

  describe('separator', () => {
    it('has app-grid-separator class when isLast is false', async () => {
      await setup(fakeMatchBase(), false);
      expect(fixture.nativeElement.classList).toContain('app-grid-separator');
    });

    it('does not have app-grid-separator class when isLast is true', async () => {
      await setup(fakeMatchBase(), true);
      expect(fixture.nativeElement.classList).not.toContain('app-grid-separator');
    });
  });

  // Team names -----------------------------------------------------------------------------------

  describe('team names', () => {
    it('renders home team name', async () => {
      const homeTeam = { ...fakeTeamBase(), name: 'Team1' };
      await setup({ ...fakeMatchBase(), homeTeam });

      expect(fixture.nativeElement.textContent).toContain('Team1');
    });

    it('renders away team name', async () => {
      const awayTeam = { ...fakeTeamBase(), name: 'Team2' };
      await setup({ ...fakeMatchBase(), awayTeam });

      expect(fixture.nativeElement.textContent).toContain('Team2');
    });
  });

  // Kickoff time ---------------------------------------------------------------------------------

  describe('kickoff time', () => {
    it('renders in HH:mm format', async () => {
      const datetime = '2025-06-15T14:30:00.000Z';
      await setup({ ...fakeMatchBase(), status: Status.PENDING, datetime });

      const date = new Date(datetime);
      const expected = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      expect(fixture.nativeElement.textContent).toContain(expected);
    });

    it('renders date above time when showDate is true', async () => {
      const datetime = '2025-06-15T14:30:00.000Z';
      await setup({ ...fakeMatchBase(), status: Status.PENDING, datetime }, true, true);

      expect(fixture.nativeElement.textContent).toContain('Jun 15');
    });

    it('does not render date when showDate is false', async () => {
      const datetime = '2025-06-15T14:30:00.000Z';
      await setup({ ...fakeMatchBase(), status: Status.PENDING, datetime });

      expect(fixture.nativeElement.textContent).not.toContain('Jun 15');
    });
  });

  // Elapsed time ---------------------------------------------------------------------------------

  describe('elapsed time', () => {
    it('renders for active match', async () => {
      await setup({ ...fakeMatchBase(), status: Status.ACTIVE, elapsed: '45' });

      expect(fixture.nativeElement.textContent).toContain('45');
    });

    it('renders for full time match', async () => {
      await setup({ ...fakeMatchBase(), status: Status.FULL_TIME, elapsed: 'FT' });

      expect(fixture.nativeElement.textContent).toContain('FT');
    });

    it('renders for finished match', async () => {
      await setup({ ...fakeMatchBase(), status: Status.FINISHED, elapsed: 'FT' });

      expect(fixture.nativeElement.textContent).toContain('FT');
    });

    it('does not render for pending match', async () => {
      await setup({ ...fakeMatchBase(), status: Status.PENDING, elapsed: 'N/A' });

      expect(fixture.nativeElement.textContent).not.toContain('N/A');
    });

    describe('full time indicator', () => {
      it('renders * when status is FULL_TIME', async () => {
        await setup({ ...fakeMatchBase(), status: Status.FULL_TIME });

        const errorSpan = fixture.nativeElement.querySelector('span.text-error');
        expect(errorSpan).toBeTruthy();
        expect(errorSpan.textContent.trim()).toBe('*');
      });

      it('does not render * when status is ACTIVE', async () => {
        await setup({ ...fakeMatchBase(), status: Status.ACTIVE });

        expect(fixture.nativeElement.querySelector('span.text-error')).toBeNull();
      });

      it('does not render * when status is FINISHED', async () => {
        await setup({ ...fakeMatchBase(), status: Status.FINISHED });

        expect(fixture.nativeElement.querySelector('span.text-error')).toBeNull();
      });
    });

    describe('active match elapsed styling', () => {
      it('elapsed span has bg-primary class when status is ACTIVE', async () => {
        await setup({ ...fakeMatchBase(), status: Status.ACTIVE, elapsed: '45' });

        const elapsedSpan = Array.from<HTMLElement>(
          fixture.nativeElement.querySelectorAll('span'),
        ).find((span) => span.textContent?.trim().startsWith('45'));
        expect(elapsedSpan?.classList).toContain('bg-primary');
      });

      it('elapsed span does not have bg-primary class when status is FULL_TIME', async () => {
        await setup({ ...fakeMatchBase(), status: Status.FULL_TIME, elapsed: 'FT' });

        const elapsedSpan = Array.from<HTMLElement>(
          fixture.nativeElement.querySelectorAll('span'),
        ).find((span) => span.textContent?.trim().startsWith('FT'));
        expect(elapsedSpan?.classList).not.toContain('bg-primary');
      });

      it('elapsed span does not have bg-primary class when status is FINISHED', async () => {
        await setup({ ...fakeMatchBase(), status: Status.FINISHED, elapsed: 'FT' });

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
        ...fakeMatchBase(),
        status: Status.ACTIVE,
        homeTeamGoalsScored: 101,
        awayTeamGoalsScored: 103,
      });

      expect(fixture.nativeElement.textContent).toContain('101');
      expect(fixture.nativeElement.textContent).toContain('103');
    });

    it('renders for full time match', async () => {
      await setup({
        ...fakeMatchBase(),
        status: Status.FULL_TIME,
        homeTeamGoalsScored: 101,
        awayTeamGoalsScored: 103,
      });

      expect(fixture.nativeElement.textContent).toContain('101');
      expect(fixture.nativeElement.textContent).toContain('103');
    });

    it('renders for finished match', async () => {
      await setup({
        ...fakeMatchBase(),
        status: Status.FINISHED,
        homeTeamGoalsScored: 101,
        awayTeamGoalsScored: 103,
      });

      expect(fixture.nativeElement.textContent).toContain('101');
      expect(fixture.nativeElement.textContent).toContain('103');
    });

    it('does not render for pending match', async () => {
      await setup({
        ...fakeMatchBase(),
        status: Status.PENDING,
        homeTeamGoalsScored: 101,
        awayTeamGoalsScored: 103,
      });

      expect(fixture.nativeElement.textContent).not.toContain('101');
      expect(fixture.nativeElement.textContent).not.toContain('103');
    });

    it('does not render for postponed match', async () => {
      await setup({
        ...fakeMatchBase(),
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
          ...fakeMatchBase(),
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
          ...fakeMatchBase(),
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
          ...fakeMatchBase(),
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
          ...fakeMatchBase(),
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
          ...fakeMatchBase(),
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
});
