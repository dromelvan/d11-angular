import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { Status, TransferWindow, TransferWindowPositionCount } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakePosition, fakeTransferWindow } from '@app/test';
import { expect, vi } from 'vitest';
import { TransfersHeaderCardComponent } from './transfers-header-card.component';

let transferWindow: TransferWindow;

const fakePositionCount = (
  overrides: Partial<TransferWindowPositionCount> = {},
): TransferWindowPositionCount => ({
  position: fakePosition(),
  transferListingCount: 3,
  transferCount: 1,
  ...overrides,
});

let previousCalled = false;
let nextCalled = false;

@Component({
  template: ` <app-transfers-header-card
    [transferWindow]="transferWindow"
    [hasPrevious]="hasPrevious"
    [hasNext]="hasNext"
    (previous)="onPrevious()"
    (next)="onNext()"
  />`,
  standalone: true,
  imports: [TransfersHeaderCardComponent],
})
class HostComponent {
  transferWindow = transferWindow;
  hasPrevious = true;
  hasNext = true;
  onPrevious() {
    previousCalled = true;
  }
  onNext() {
    nextCalled = true;
  }
}

@Component({
  template: ` <app-transfers-header-card
    [transferWindow]="transferWindow"
    [hasPrevious]="false"
    [hasNext]="false"
    (previous)="onPrevious()"
    (next)="onNext()"
  />`,
  standalone: true,
  imports: [TransfersHeaderCardComponent],
})
class DisabledNavHostComponent {
  transferWindow = transferWindow;
  onPrevious() {
    previousCalled = true;
  }
  onNext() {
    nextCalled = true;
  }
}

describe('TransfersHeaderCardComponent', () => {
  describe('with transfer window', () => {
    beforeEach(async () => {
      transferWindow = {
        ...fakeTransferWindow(),
        transferWindowNumber: 5,
        status: Status.ACTIVE,
        draft: false,
      };

      await render(HostComponent, {
        providers: [{ provide: RouterService, useValue: { navigateToMatchWeek: vi.fn() } }],
      });
    });

    it('renders', () => {
      expect(document.querySelector('app-transfers-header-card')).toBeInTheDocument();
    });

    it('renders the transfer window number', () => {
      expect(screen.getByText('Transfer Window 5')).toBeInTheDocument();
    });

    it('renders the season name', () => {
      expect(screen.getByText(transferWindow.season.name)).toBeInTheDocument();
    });

    it('renders the match week number', () => {
      expect(
        screen.getByText(`Match week ${transferWindow.matchWeek.matchWeekNumber}`, {
          exact: false,
        }),
      ).toBeInTheDocument();
    });
  });

  describe('with position counts', () => {
    let positionCounts: TransferWindowPositionCount[];

    beforeEach(async () => {
      positionCounts = [
        fakePositionCount({ position: { ...fakePosition(), name: 'Goalkeeper' } }),
        fakePositionCount({ position: { ...fakePosition(), name: 'Defender' } }),
      ];

      transferWindow = {
        ...fakeTransferWindow(),
        status: Status.ACTIVE,
        draft: false,
        transferWindowPositionCounts: positionCounts,
      };

      await render(HostComponent, {
        providers: [{ provide: RouterService, useValue: { navigateToMatchWeek: vi.fn() } }],
      });
    });

    it('renders position names', () => {
      for (const pc of positionCounts) {
        expect(screen.getByText(pc.position.name)).toBeInTheDocument();
      }
    });

    it('renders listing counts', () => {
      for (const pc of positionCounts) {
        expect(screen.getAllByText(String(pc.transferListingCount)).length).toBeGreaterThan(0);
      }
    });

    it('renders transfer counts', () => {
      for (const pc of positionCounts) {
        expect(screen.getAllByText(String(pc.transferCount)).length).toBeGreaterThan(0);
      }
    });
  });

  describe('navigation', () => {
    beforeEach(async () => {
      previousCalled = false;
      nextCalled = false;

      transferWindow = {
        ...fakeTransferWindow(),
        status: Status.ACTIVE,
        draft: false,
      };

      await render(HostComponent, {
        providers: [{ provide: RouterService, useValue: { navigateToMatchWeek: vi.fn() } }],
      });
    });

    it('emits previous when left chevron is clicked', async () => {
      await userEvent.click(screen.getByRole('button', { name: /chevron_left/i }));
      expect(previousCalled).toBe(true);
    });

    it('emits next when right chevron is clicked', async () => {
      await userEvent.click(screen.getByRole('button', { name: /chevron_right/i }));
      expect(nextCalled).toBe(true);
    });
  });

  describe('disabled navigation', () => {
    beforeEach(async () => {
      transferWindow = {
        ...fakeTransferWindow(),
        status: Status.ACTIVE,
        draft: false,
      };

      await render(DisabledNavHostComponent, {
        providers: [{ provide: RouterService, useValue: { navigateToMatchWeek: vi.fn() } }],
      });
    });

    it('disables previous button when hasPrevious is false', () => {
      expect(screen.getByRole('button', { name: /chevron_left/i })).toBeDisabled();
    });

    it('disables next button when hasNext is false', () => {
      expect(screen.getByRole('button', { name: /chevron_right/i })).toBeDisabled();
    });
  });

  describe('with no transfer window', () => {
    beforeEach(async () => {
      transferWindow = undefined as unknown as TransferWindow;

      await render(HostComponent, {
        providers: [{ provide: RouterService, useValue: { navigateToMatchWeek: vi.fn() } }],
      });
    });

    it('renders', () => {
      expect(document.querySelector('app-transfers-header-card')).toBeInTheDocument();
    });

    it('renders nothing', () => {
      expect(document.querySelector('.app-transfers-header-card')).not.toBeInTheDocument();
    });
  });
});
