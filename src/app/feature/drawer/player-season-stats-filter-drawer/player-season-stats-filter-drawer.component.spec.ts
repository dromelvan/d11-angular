import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { PlayerSeasonStatSort, POSITION_IDS } from '@app/core/api';
import { PlayerSeasonStatsFilterDrawerParams } from '@app/shared/model';
import { PlayerSeasonStatsFilterDrawerComponent } from './player-season-stats-filter-drawer.component';

const defaultFilterParams: PlayerSeasonStatsFilterDrawerParams = {
  dummy: undefined,
  positionIds: [
    POSITION_IDS.KEEPER,
    POSITION_IDS.DEFENDER,
    POSITION_IDS.MIDFIELDER,
    POSITION_IDS.FORWARD,
  ],
  sort: PlayerSeasonStatSort.RANKING,
};

const openInputs = { visible: true, filterParams: defaultFilterParams };

describe('PlayerSeasonStatsFilterDrawerComponent', () => {
  describe('renders', () => {
    it('renders availability options', async () => {
      await render(PlayerSeasonStatsFilterDrawerComponent, { inputs: openInputs });
      TestBed.tick();

      expect(screen.getByText('Availability')).toBeInTheDocument();
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Available')).toBeInTheDocument();
      expect(screen.getByText('Unavailable')).toBeInTheDocument();
    });

    it('renders position options', async () => {
      await render(PlayerSeasonStatsFilterDrawerComponent, { inputs: openInputs });
      TestBed.tick();

      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Keeper')).toBeInTheDocument();
      expect(screen.getByText('Defender')).toBeInTheDocument();
      expect(screen.getByText('Midfielder')).toBeInTheDocument();
      expect(screen.getByText('Forward')).toBeInTheDocument();
    });

    it('renders sort options', async () => {
      await render(PlayerSeasonStatsFilterDrawerComponent, { inputs: openInputs });
      TestBed.tick();

      expect(screen.getByText('Sort')).toBeInTheDocument();
      expect(screen.getByText('Ranking')).toBeInTheDocument();
      expect(screen.getByText('Goals')).toBeInTheDocument();
      expect(screen.getByText('Rating')).toBeInTheDocument();
      expect(screen.getByText('Form')).toBeInTheDocument();
    });
  });

  describe('done', () => {
    it('emits filterParamsChange with current draft when Done is clicked', async () => {
      const { fixture } = await render(PlayerSeasonStatsFilterDrawerComponent, {
        inputs: openInputs,
      });
      TestBed.tick();

      let emitted: PlayerSeasonStatsFilterDrawerParams | undefined;
      fixture.componentInstance.filterParamsChange.subscribe((value) => (emitted = value));

      await userEvent.click(screen.getByText('Done'));

      expect(emitted).toEqual(defaultFilterParams);
    });

    it('sets visible to false when Done is clicked', async () => {
      const { fixture } = await render(PlayerSeasonStatsFilterDrawerComponent, {
        inputs: openInputs,
      });
      TestBed.tick();

      await userEvent.click(screen.getByText('Done'));
      TestBed.tick();

      expect(fixture.componentInstance.visible()).toBe(false);
    });
  });

  describe('filter changes', () => {
    it('emits updated dummy when availability changes to Available', async () => {
      const { fixture } = await render(PlayerSeasonStatsFilterDrawerComponent, {
        inputs: openInputs,
      });
      TestBed.tick();

      let emitted: PlayerSeasonStatsFilterDrawerParams | undefined;
      fixture.componentInstance.filterParamsChange.subscribe((value) => (emitted = value));

      await userEvent.click(screen.getByText('Available'));
      await userEvent.click(screen.getByText('Done'));

      expect(emitted?.dummy).toBe(true);
    });

    it('emits updated dummy when availability changes to Unavailable', async () => {
      const { fixture } = await render(PlayerSeasonStatsFilterDrawerComponent, {
        inputs: openInputs,
      });
      TestBed.tick();

      let emitted: PlayerSeasonStatsFilterDrawerParams | undefined;
      fixture.componentInstance.filterParamsChange.subscribe((value) => (emitted = value));

      await userEvent.click(screen.getByText('Unavailable'));
      await userEvent.click(screen.getByText('Done'));

      expect(emitted?.dummy).toBe(false);
    });

    it('emits updated sort when sort changes to Goals', async () => {
      const { fixture } = await render(PlayerSeasonStatsFilterDrawerComponent, {
        inputs: openInputs,
      });
      TestBed.tick();

      let emitted: PlayerSeasonStatsFilterDrawerParams | undefined;
      fixture.componentInstance.filterParamsChange.subscribe((value) => (emitted = value));

      await userEvent.click(screen.getByText('Goals'));
      await userEvent.click(screen.getByText('Done'));

      expect(emitted?.sort).toBe(PlayerSeasonStatSort.GOALS);
    });

    it('emits updated positionIds when Keeper is deselected', async () => {
      const { fixture } = await render(PlayerSeasonStatsFilterDrawerComponent, {
        inputs: openInputs,
      });
      TestBed.tick();

      let emitted: PlayerSeasonStatsFilterDrawerParams | undefined;
      fixture.componentInstance.filterParamsChange.subscribe((value) => (emitted = value));

      await userEvent.click(screen.getByText('Keeper'));
      await userEvent.click(screen.getByText('Done'));

      expect(emitted?.positionIds).not.toContain(POSITION_IDS.KEEPER);
    });
  });

  describe('draft reset', () => {
    it('resets draft to filterParams when opened', async () => {
      const { fixture } = await render(PlayerSeasonStatsFilterDrawerComponent, {
        inputs: { visible: false, filterParams: defaultFilterParams },
      });
      TestBed.tick();

      const updatedParams: PlayerSeasonStatsFilterDrawerParams = {
        ...defaultFilterParams,
        sort: PlayerSeasonStatSort.GOALS,
      };
      fixture.componentRef.setInput('filterParams', updatedParams);
      fixture.componentRef.setInput('visible', true);
      TestBed.tick();

      let emitted: PlayerSeasonStatsFilterDrawerParams | undefined;
      fixture.componentInstance.filterParamsChange.subscribe((value) => (emitted = value));
      await userEvent.click(screen.getByText('Done'));

      expect(emitted?.sort).toBe(PlayerSeasonStatSort.GOALS);
    });
  });
});
