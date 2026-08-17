import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { PlayerSeasonStatSort, POSITION_IDS } from '@app/core/api';
import { PlayerSeasonStatsSectionComponent } from './player-season-stats-section.component';
import { PlayerSeasonStatsFilterDrawerComponent } from './player-season-stats-filter-drawer/player-season-stats-filter-drawer.component';

const drawerInstance = (fixture: ComponentFixture<PlayerSeasonStatsSectionComponent>) =>
  fixture.debugElement.query(By.directive(PlayerSeasonStatsFilterDrawerComponent))
    .componentInstance as PlayerSeasonStatsFilterDrawerComponent;

describe('PlayerSeasonStatsSectionComponent', () => {
  const providers = [provideHttpClient(), provideHttpClientTesting(), provideRouter([])];

  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  describe('renders', () => {
    it('renders section header', async () => {
      await render(PlayerSeasonStatsSectionComponent, { inputs: { seasonId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByText('Season Statistics')).toBeInTheDocument();
    });

    it('renders filter button', async () => {
      await render(PlayerSeasonStatsSectionComponent, { inputs: { seasonId: 1 }, providers });
      TestBed.tick();

      expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();
    });
  });

  describe('isGrow', () => {
    it('sets min-height on host while data is loading', async () => {
      const { fixture } = await render(PlayerSeasonStatsSectionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      expect(fixture.nativeElement).toHaveStyle('min-height: 1450px');
    });
  });

  describe('filter drawer', () => {
    it('opens drawer when filter button is clicked', async () => {
      const { fixture } = await render(PlayerSeasonStatsSectionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      await userEvent.click(screen.getByRole('button', { name: /more/i }));
      TestBed.tick();

      expect(drawerInstance(fixture).visible()).toBe(true);
    });

    it('passes default filterParams to drawer on open', async () => {
      const { fixture } = await render(PlayerSeasonStatsSectionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      await userEvent.click(screen.getByRole('button', { name: /more/i }));
      TestBed.tick();

      expect(drawerInstance(fixture).filterParams()).toEqual({
        dummy: undefined,
        positionIds: [
          POSITION_IDS.KEEPER,
          POSITION_IDS.DEFENDER,
          POSITION_IDS.MIDFIELDER,
          POSITION_IDS.FORWARD,
        ],
        sort: PlayerSeasonStatSort.RANKING,
      });
    });

    it('resets filterParams to defaults when seasonId changes', async () => {
      const { fixture } = await render(PlayerSeasonStatsSectionComponent, {
        inputs: { seasonId: 1 },
        providers,
      });
      TestBed.tick();

      // Simulate committed filter change via filterParamsChange output
      fixture.debugElement
        .query(By.directive(PlayerSeasonStatsFilterDrawerComponent))
        .componentInstance.filterParamsChange.emit({
          dummy: true,
          positionIds: [POSITION_IDS.FORWARD],
          sort: PlayerSeasonStatSort.GOALS,
        });
      TestBed.tick();

      fixture.componentRef.setInput('seasonId', 2);
      TestBed.tick();

      expect(drawerInstance(fixture).filterParams()).toEqual({
        dummy: undefined,
        positionIds: [
          POSITION_IDS.KEEPER,
          POSITION_IDS.DEFENDER,
          POSITION_IDS.MIDFIELDER,
          POSITION_IDS.FORWARD,
        ],
        sort: PlayerSeasonStatSort.RANKING,
      });
    });

    it('applies filterParamsChange to the API call', async () => {
      const { fixture } = await render(PlayerSeasonStatsSectionComponent, {
        inputs: { seasonId: 3 },
        providers,
      });
      TestBed.tick();

      const httpMock = TestBed.inject(HttpTestingController);
      httpMock
        .match(() => true)
        .forEach((req) => req.flush({ elements: [], totalElements: 0, totalPages: 0, page: 0 }));

      fixture.debugElement
        .query(By.directive(PlayerSeasonStatsFilterDrawerComponent))
        .componentInstance.filterParamsChange.emit({
          dummy: true,
          positionIds: [POSITION_IDS.FORWARD],
          sort: PlayerSeasonStatSort.GOALS,
        });
      TestBed.tick();

      const requests = httpMock.match(() => true);
      expect(requests.length).toBeGreaterThan(0);
      const url = requests[0].request.url + requests[0].request.urlWithParams;
      expect(url).toContain('3');

      requests.forEach((req) =>
        req.flush({ elements: [], totalElements: 0, totalPages: 0, page: 0 }),
      );
      httpMock.verify();
    });
  });
});
