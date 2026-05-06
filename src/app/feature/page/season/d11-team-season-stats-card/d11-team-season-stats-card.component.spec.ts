import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11TeamSeasonStat } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeD11TeamBase, fakeD11TeamSeasonStat } from '@app/test';
import { beforeEach, describe, expect, vi } from 'vitest';
import { D11TeamSeasonStatsCardComponent } from './d11-team-season-stats-card.component';

const mockRouterService = { navigateToD11Team: vi.fn() };

describe('D11TeamSeasonStatsCardComponent', () => {
  let fixture: ComponentFixture<D11TeamSeasonStatsCardComponent>;

  async function setup(d11TeamSeasonStats: D11TeamSeasonStat[]) {
    fixture = TestBed.createComponent(D11TeamSeasonStatsCardComponent);
    fixture.componentRef.setInput('d11TeamSeasonStats', d11TeamSeasonStats);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [D11TeamSeasonStatsCardComponent],
      providers: [{ provide: RouterService, useValue: mockRouterService }],
    }).compileComponents();
  });

  it('creates the component', async () => {
    await setup([]);
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Header and column labels ----------------------------------------------------------------------

  it('renders "D11" card header', async () => {
    await setup([]);
    expect(fixture.nativeElement.textContent).toContain('D11');
  });

  it('renders column headers', async () => {
    await setup([fakeD11TeamSeasonStat()]);

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Team');
    expect(text).toContain('GD');
    expect(text).toContain('Pts');
    expect(text).toContain('P');
    expect(text).toContain('W');
    expect(text).toContain('L');
    expect(text).toContain('GF');
    expect(text).toContain('GA');
  });

  // Renders ---------------------------------------------------------------------------------------

  describe('renders', () => {
    let d11TeamSeasonStats: D11TeamSeasonStat[];

    beforeEach(async () => {
      d11TeamSeasonStats = [
        {
          ...fakeD11TeamSeasonStat(),
          ranking: 1,
          points: 1,
          d11Team: { ...fakeD11TeamBase(), name: 'AAAAAA', shortName: 'AAA' },
        },
        {
          ...fakeD11TeamSeasonStat(),
          ranking: 2,
          points: 2,
          d11Team: { ...fakeD11TeamBase(), name: 'BBBBBB', shortName: 'BBB' },
        },
      ];
      await setup(d11TeamSeasonStats);
    });

    it('renders d11 team names', () => {
      for (const stat of d11TeamSeasonStats) {
        expect(fixture.nativeElement.textContent).toContain(stat.d11Team.name);
      }
    });

    it('renders ranking numbers in order', () => {
      const cells = Array.from<HTMLElement>(
        fixture.nativeElement.querySelectorAll('[data-testid="ranking"]'),
      );
      const rendered = cells.map((el) => Number(el.textContent?.trim()));
      expect(rendered).toEqual(d11TeamSeasonStats.map((s) => s.ranking));
    });

    it('renders points in order', () => {
      const cells = Array.from<HTMLElement>(
        fixture.nativeElement.querySelectorAll('[data-testid="points"]'),
      );
      const rendered = cells.map((el) => Number(el.textContent?.trim()));
      expect(rendered).toEqual(d11TeamSeasonStats.map((s) => s.points));
    });
  });

  // Goal difference -------------------------------------------------------------------------------

  describe('goal difference', () => {
    it('shows positive goal difference', async () => {
      await setup([
        { ...fakeD11TeamSeasonStat(), ranking: 1, previousRanking: 1, goalDifference: 5 },
      ]);

      expect(
        fixture.nativeElement.querySelector('[data-testid="goal-difference"]').textContent?.trim(),
      ).toBe('+5');
    });

    it('shows zero goal difference', async () => {
      await setup([
        { ...fakeD11TeamSeasonStat(), ranking: 1, previousRanking: 1, goalDifference: 0 },
      ]);

      expect(
        fixture.nativeElement.querySelector('[data-testid="goal-difference"]').textContent?.trim(),
      ).toBe('0');
    });

    it('shows negative goal difference', async () => {
      await setup([
        { ...fakeD11TeamSeasonStat(), ranking: 1, previousRanking: 1, goalDifference: -3 },
      ]);

      expect(
        fixture.nativeElement.querySelector('[data-testid="goal-difference"]').textContent?.trim(),
      ).toBe('-3');
    });
  });

  // Ranking change indicator ----------------------------------------------------------------------

  describe('ranking change', () => {
    it('does not render ranking change indicator when ranking is unchanged', async () => {
      await setup([{ ...fakeD11TeamSeasonStat(), ranking: 5, previousRanking: 5 }]);

      expect(fixture.nativeElement.querySelector('app-icon')).toBeNull();
    });

    it('renders ranking change indicator on ranking up', async () => {
      await setup([{ ...fakeD11TeamSeasonStat(), ranking: 3, previousRanking: 6 }]);

      expect(fixture.nativeElement.querySelector('app-icon')).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('+3');
    });

    it('renders ranking change indicator on ranking down', async () => {
      await setup([{ ...fakeD11TeamSeasonStat(), ranking: 8, previousRanking: 5 }]);

      expect(fixture.nativeElement.querySelector('app-icon')).toBeTruthy();
      expect(fixture.nativeElement.textContent).toContain('-3');
    });
  });

  // Navigation ------------------------------------------------------------------------------------

  describe('navigation', () => {
    it('navigates to d11 team page when row is clicked', async () => {
      const stat = fakeD11TeamSeasonStat();
      await setup([stat]);

      fixture.nativeElement.querySelector('.col-span-4').click();

      expect(mockRouterService.navigateToD11Team).toHaveBeenCalledExactlyOnceWith(
        stat.d11Team.id,
        stat.season.id,
      );
    });
  });

  // Separator -------------------------------------------------------------------------------------

  describe('separator', () => {
    it('adds app-grid-separator to non-last rows', async () => {
      await setup([fakeD11TeamSeasonStat(), fakeD11TeamSeasonStat()]);

      const rows = fixture.nativeElement.querySelectorAll('.col-span-4');
      expect(rows[0].classList).toContain('app-grid-separator');
      expect(rows[1].classList).not.toContain('app-grid-separator');
    });
  });

  // Row background classes ------------------------------------------------------------------------

  describe('backgrounds', () => {
    function buildTable(count: number): D11TeamSeasonStat[] {
      return Array.from({ length: count }, (_, i) => ({
        ...fakeD11TeamSeasonStat(),
        id: i + 1,
        ranking: i + 1,
        previousRanking: i + 1,
        d11Team: { ...fakeD11TeamBase(), name: `Team${i + 1}` },
      }));
    }

    function getRows(): NodeListOf<Element> {
      return fixture.nativeElement.querySelectorAll('.col-span-4');
    }

    it('first row has bg-primary class', async () => {
      await setup(buildTable(10));

      const rows = getRows();
      expect(rows[0].classList).toContain('bg-primary');
      expect(rows[1].classList).not.toContain('bg-primary');
    });

    it('rows at index 1 to 3 have bg-surface-500 class', async () => {
      await setup(buildTable(10));

      const rows = getRows();
      for (let i = 1; i <= 3; i++) {
        expect(rows[i].classList).toContain('bg-surface-500');
      }
      expect(rows[0].classList).not.toContain('bg-surface-500');
      expect(rows[4].classList).not.toContain('bg-surface-500');
    });

    it('rows at index 0 to 3 have text-primary-contrast class', async () => {
      await setup(buildTable(10));

      const rows = getRows();
      for (let i = 0; i <= 3; i++) {
        expect(rows[i].classList).toContain('text-primary-contrast');
      }
      expect(rows[4].classList).not.toContain('text-primary-contrast');
    });

    it('rows from index 4 onward have neither bg-primary nor bg-surface-500', async () => {
      await setup(buildTable(10));

      const rows = getRows();
      for (let i = 4; i < rows.length; i++) {
        expect(rows[i].classList).not.toContain('bg-primary');
        expect(rows[i].classList).not.toContain('bg-surface-500');
      }
    });
  });
});
