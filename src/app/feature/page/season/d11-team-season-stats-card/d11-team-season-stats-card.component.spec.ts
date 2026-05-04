import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11TeamSeasonStat } from '@app/core/api';
import { fakeD11TeamBase, fakeD11TeamSeasonStat } from '@app/test';
import { beforeEach, describe, expect, vi } from 'vitest';
import { D11TeamSeasonStatsCardComponent } from './d11-team-season-stats-card.component';

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
    }).compileComponents();
  });

  it('creates the component', async () => {
    await setup([]);
    expect(fixture.componentInstance).toBeTruthy();
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
