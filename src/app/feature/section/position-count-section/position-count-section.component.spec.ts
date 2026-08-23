import { render, screen } from '@testing-library/angular';
import { Status, TransferWindow, TransferWindowPositionCount } from '@app/core/api';
import { fakePosition, fakeTransferWindow } from '@app/test';
import { expect } from 'vitest';
import { PositionCountSectionComponent } from './position-count-section.component';

const fakePositionCount = (
  overrides: Partial<TransferWindowPositionCount> = {},
): TransferWindowPositionCount => ({
  position: fakePosition(),
  transferListingCount: 3,
  transferCount: 1,
  ...overrides,
});

const template = `<app-position-count-section [transferWindow]="transferWindow" />`;

describe('PositionCountSectionComponent', () => {
  async function setup(transferWindow?: TransferWindow) {
    return render(template, {
      imports: [PositionCountSectionComponent],
      componentProperties: { transferWindow },
    });
  }

  describe('with no transfer window', () => {
    beforeEach(async () => {
      await setup(undefined);
    });

    it('renders', () => {
      expect(document.querySelector('app-position-count-section')).toBeInTheDocument();
    });
  });

  describe('with PENDING status', () => {
    beforeEach(async () => {
      await setup({
        ...fakeTransferWindow(),
        status: Status.PENDING,
        transferWindowPositionCounts: [fakePositionCount()],
      });
    });

    it('does not render position counts', () => {
      expect(screen.queryByText(/Out:/, { exact: false })).not.toBeInTheDocument();
    });
  });

  describe('with position counts', () => {
    let positionCounts: TransferWindowPositionCount[];

    beforeEach(async () => {
      positionCounts = [
        fakePositionCount({
          position: { ...fakePosition(), name: 'Goalkeeper' },
          transferListingCount: 3,
          transferCount: 1,
        }),
        fakePositionCount({
          position: { ...fakePosition(), name: 'Defender' },
          transferListingCount: 5,
          transferCount: 2,
        }),
      ];
      await setup({
        ...fakeTransferWindow(),
        status: Status.ACTIVE,
        transferWindowPositionCounts: positionCounts,
      });
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
        expect(
          screen.getAllByText(new RegExp(`Need: ${need}`), { exact: false }).length,
        ).toBeGreaterThan(0);
      }
    });
  });
});
