import { TestBed } from '@angular/core/testing';
import { render, screen } from '@testing-library/angular';
import { Status, TransferWindow, TransferWindowPositionCount } from '@app/core/api';
import { fakePosition, fakeTransferWindow } from '@app/test';
import { describe, expect, it, beforeEach } from 'vitest';
import { PositionCountInfoBoxComponent } from './position-count-info-box.component';

const fakePositionCount = (
  overrides: Partial<TransferWindowPositionCount> = {},
): TransferWindowPositionCount => ({
  position: fakePosition(),
  transferListingCount: 3,
  transferCount: 1,
  ...overrides,
});

describe('PositionCountInfoBoxComponent', () => {
  describe('with no transfer window', () => {
    beforeEach(async () => {
      await render(PositionCountInfoBoxComponent, {
        inputs: { transferWindow: undefined },
      });
      TestBed.tick();
    });

    it('renders "Position Count" header', () => {
      expect(screen.getByText('Position Count')).toBeInTheDocument();
    });

    it('does not render position counts', () => {
      expect(screen.queryByText(/Out:/, { exact: false })).not.toBeInTheDocument();
    });
  });

  describe('with PENDING status', () => {
    beforeEach(async () => {
      await render(PositionCountInfoBoxComponent, {
        inputs: {
          transferWindow: {
            ...fakeTransferWindow(),
            status: Status.PENDING,
            transferWindowPositionCounts: [fakePositionCount()],
          } as TransferWindow,
        },
      });
      TestBed.tick();
    });

    it('does not render position counts', () => {
      expect(screen.queryByText(/Out:/, { exact: false })).not.toBeInTheDocument();
    });
  });

  describe('with empty position counts', () => {
    beforeEach(async () => {
      await render(PositionCountInfoBoxComponent, {
        inputs: {
          transferWindow: {
            ...fakeTransferWindow(),
            status: Status.ACTIVE,
            transferWindowPositionCounts: [],
          } as TransferWindow,
        },
      });
      TestBed.tick();
    });

    it('does not render position counts', () => {
      expect(screen.queryByText(/Out:/, { exact: false })).not.toBeInTheDocument();
    });
  });

  describe('with position counts', () => {
    let positionCounts: TransferWindowPositionCount[];
    let container: HTMLElement;

    beforeEach(async () => {
      positionCounts = [
        fakePositionCount({
          position: { ...fakePosition(), id: 1, name: 'Goalkeeper' },
          transferListingCount: 3,
          transferCount: 1,
        }),
        fakePositionCount({
          position: { ...fakePosition(), id: 2, name: 'Defender' },
          transferListingCount: 5,
          transferCount: 2,
        }),
      ];
      ({ container } = await render(PositionCountInfoBoxComponent, {
        inputs: {
          transferWindow: {
            ...fakeTransferWindow(),
            status: Status.ACTIVE,
            transferWindowPositionCounts: positionCounts,
          } as TransferWindow,
        },
      }));
      TestBed.tick();
    });

    it('renders position names', () => {
      expect(screen.getByText('Goalkeeper')).toBeInTheDocument();
      expect(screen.getByText('Defender')).toBeInTheDocument();
    });

    it('renders Out counts', () => {
      for (const pc of positionCounts) {
        expect(
          screen.getByText(`Out: ${pc.transferListingCount}`, { exact: false }),
        ).toBeInTheDocument();
      }
    });

    it('renders In counts', () => {
      for (const pc of positionCounts) {
        expect(screen.getByText(`In: ${pc.transferCount}`, { exact: false })).toBeInTheDocument();
      }
    });

    it('renders Need counts', () => {
      for (const pc of positionCounts) {
        const need = pc.transferListingCount - pc.transferCount;
        expect(container.textContent).toContain(`Need: ${need}`);
      }
    });
  });
});
