import { Component, signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { NgClass } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DynamicListDialogHeaderComponent } from './dynamic-list-dialog-header.component';
import { fakeTeamBase } from '@app/core/api/test/faker-util';
import { TeamBaseContainer } from '@app/core/api/model/team-base-container';
import { PRIMARY } from '@app/app.theme';

@Component({
  selector: 'app-test-header',
  imports: [NgClass],
  template: `
    <div data-testid="bg" [style.background-color]="backgroundColor()"></div>
    <div data-testid="text-class" [ngClass]="textClass()"></div>
    <div data-testid="index">{{ index() }}</div>
    <button data-testid="prev" [disabled]="!hasPrevious()" (click)="onPrevious()">prev</button>
    <button data-testid="next" [disabled]="!hasNext()" (click)="onNext()">next</button>
  `,
})
class TestHeaderComponent extends DynamicListDialogHeaderComponent {}

function fakeItem(dummy = false): TeamBaseContainer {
  return { team: { ...fakeTeamBase(), dummy } };
}

function buildConfig(items: TeamBaseContainer[], initial = items[0]) {
  const current = signal(initial);
  return { data: { current, list: items } };
}

describe('DynamicListDialogHeaderComponent', () => {
  async function setup(items: TeamBaseContainer[], initial?: TeamBaseContainer) {
    const config = buildConfig(items, initial ?? items[0]);

    await render(TestHeaderComponent, {
      providers: [{ provide: DynamicDialogConfig, useValue: config }],
    });

    return config;
  }

  describe('backgroundColor', () => {
    it('uses team colour for non-dummy team', async () => {
      const item = fakeItem(false);
      item.team.colour = '#ff0000';

      await setup([item]);

      expect(screen.getByTestId('bg')).toHaveStyle('background-color: rgb(255, 0, 0)');
    });

    it('uses primary colour for dummy team', async () => {
      const item = fakeItem(true);

      await setup([item]);

      expect(screen.getByTestId('bg')).toHaveStyle(`background-color: ${PRIMARY}`);
    });
  });

  describe('textClass', () => {
    it('applies contrast text colour for dark background', async () => {
      const item = fakeItem(false);
      item.team.colour = '#0b164f';

      await setup([item]);

      expect(screen.getByTestId('text-class')).toHaveClass('text-white!');
    });

    it('applies contrast text colour for light background', async () => {
      const item = fakeItem(false);
      item.team.colour = '#ffffff';

      await setup([item]);

      expect(screen.getByTestId('text-class')).toHaveClass('text-black!');
    });
  });

  describe('index', () => {
    it('equals position of current item in list', async () => {
      const items = [fakeItem(), fakeItem(), fakeItem()];

      await setup(items, items[1]);

      expect(screen.getByTestId('index')).toHaveTextContent('1');
    });
  });

  describe('hasPrevious / hasNext', () => {
    it('disables previous and enables next at first item', async () => {
      const items = [fakeItem(), fakeItem()];

      await setup(items, items[0]);

      expect(screen.getByTestId('prev')).toBeDisabled();
      expect(screen.getByTestId('next')).not.toBeDisabled();
    });

    it('enables previous and disables next at last item', async () => {
      const items = [fakeItem(), fakeItem()];

      await setup(items, items[1]);

      expect(screen.getByTestId('prev')).not.toBeDisabled();
      expect(screen.getByTestId('next')).toBeDisabled();
    });

    it('enables both when in the middle', async () => {
      const items = [fakeItem(), fakeItem(), fakeItem()];

      await setup(items, items[1]);

      expect(screen.getByTestId('prev')).not.toBeDisabled();
      expect(screen.getByTestId('next')).not.toBeDisabled();
    });
  });

  describe('onPrevious', () => {
    it('moves current to previous item', async () => {
      const items = [fakeItem(), fakeItem()];
      const config = await setup(items, items[1]);

      await userEvent.click(screen.getByTestId('prev'));

      expect(config.data.current()).toBe(items[0]);
    });
  });

  describe('onNext', () => {
    it('moves current to next item', async () => {
      const items = [fakeItem(), fakeItem()];
      const config = await setup(items, items[0]);

      await userEvent.click(screen.getByTestId('next'));

      expect(config.data.current()).toBe(items[1]);
    });
  });
});
