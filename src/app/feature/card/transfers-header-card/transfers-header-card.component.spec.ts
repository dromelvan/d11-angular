import { render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { Status, TransferWindow, TransferWindowPositionCount } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakePosition, fakeTransferWindow } from '@app/test';
import { expect, type Mock, vi } from 'vitest';
import { TransfersHeaderCardComponent } from './transfers-header-card.component';

const fakePositionCount = (
  overrides: Partial<TransferWindowPositionCount> = {},
): TransferWindowPositionCount => ({
  position: fakePosition(),
  transferListingCount: 3,
  transferCount: 1,
  ...overrides,
});

const template = `
  <app-transfers-header-card
    [transferWindow]="transferWindow"
    [hasPrevious]="hasPrevious"
    [hasNext]="hasNext"
    (previous)="onPrevious()"
    (next)="onNext()"
  />`;

describe('TransfersHeaderCardComponent', () => {
  let transferWindow: TransferWindow;
  let navigateToMatchWeekMatchesMock: Mock<(id: number) => void>;
  let previousMock: Mock<() => void>;
  let nextMock: Mock<() => void>;

  function setup(hasPrevious = true, hasNext = true) {
    return render(template, {
      imports: [TransfersHeaderCardComponent],
      componentProperties: {
        transferWindow,
        hasPrevious,
        hasNext,
        onPrevious: () => previousMock(),
        onNext: () => nextMock(),
      },
      providers: [
        {
          provide: RouterService,
          useValue: { navigateToMatchWeekMatches: navigateToMatchWeekMatchesMock },
        },
      ],
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    navigateToMatchWeekMatchesMock = vi.fn<(id: number) => void>();
    previousMock = vi.fn<() => void>();
    nextMock = vi.fn<() => void>();
  });

  describe('with transfer window', () => {
    beforeEach(async () => {
      transferWindow = {
        ...fakeTransferWindow(),
        transferWindowNumber: 5,
        status: Status.ACTIVE,
        draft: false,
      };
      await setup();
    });

    it('renders', () => {
      expect(document.querySelector('app-transfers-header-card')).toBeInTheDocument();
    });

    it('renders transfer window number', () => {
      expect(
        screen.getByText(`Transfer Window ${transferWindow.transferWindowNumber}`),
      ).toBeInTheDocument();
    });

    it('renders season name', () => {
      expect(screen.getByText(transferWindow.season.name)).toBeInTheDocument();
    });

    it('renders match week number', () => {
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

      await setup();
    });

    it('renders positions', () => {
      for (const positionCount of positionCounts) {
        expect(screen.getByText(positionCount.position.name)).toBeInTheDocument();
      }
    });

    it('renders listing counts', () => {
      for (const positionCount of positionCounts) {
        expect(
          screen.getAllByText(String(positionCount.transferListingCount)).length,
        ).toBeGreaterThan(0);
      }
    });

    it('renders transfer counts', () => {
      for (const positionCount of positionCounts) {
        expect(screen.getAllByText(String(positionCount.transferCount)).length).toBeGreaterThan(0);
      }
    });
  });

  describe('navigation', () => {
    beforeEach(async () => {
      transferWindow = {
        ...fakeTransferWindow(),
        status: Status.ACTIVE,
        draft: false,
      };
      await setup();
    });

    it('emits previous', async () => {
      await userEvent.click(screen.getByRole('button', { name: /chevron_left/i }));
      expect(previousMock).toHaveBeenCalled();
    });

    it('emits next', async () => {
      await userEvent.click(screen.getByRole('button', { name: /chevron_right/i }));
      expect(nextMock).toHaveBeenCalled();
    });

    it('calls navigateToMatchWeekMatches on match week click', async () => {
      await userEvent.click(
        screen.getByText(`Match week ${transferWindow.matchWeek.matchWeekNumber}`, {
          exact: false,
        }),
      );
      expect(navigateToMatchWeekMatchesMock).toHaveBeenCalledWith(transferWindow.matchWeek.id);
    });
  });

  describe('disabled navigation', () => {
    beforeEach(async () => {
      transferWindow = {
        ...fakeTransferWindow(),
        status: Status.ACTIVE,
        draft: false,
      };
      await setup(false, false);
    });

    it('disables previous button when hasPrevious is false', () => {
      expect(screen.getByRole('button', { name: /chevron_left/i })).toBeDisabled();
    });

    it('disables next button when hasNext is false', () => {
      expect(screen.getByRole('button', { name: /chevron_right/i })).toBeDisabled();
    });
  });

  describe('with draft transfer window', () => {
    beforeEach(async () => {
      transferWindow = {
        ...fakeTransferWindow(),
        status: Status.ACTIVE,
        draft: true,
        datetime: '1970-01-01T00:00:00.000Z',
      };
      await setup();
    });

    it('renders draft time label', () => {
      expect(screen.getByText('Draft time:')).toBeInTheDocument();
    });

    it('does not render listing deadline', () => {
      expect(screen.queryByText('Listing deadline:')).not.toBeInTheDocument();
    });

    it('renders the draft datetime', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Jan 01, 1970/, { exact: false })).toBeInTheDocument();
      });
    });
  });

  describe('with no transfer window', () => {
    beforeEach(async () => {
      transferWindow = undefined as unknown as TransferWindow;
      await setup();
    });

    it('renders', () => {
      expect(document.querySelector('app-transfers-header-card')).toBeInTheDocument();
    });

    it('renders nothing', () => {
      expect(document.querySelector('.app-transfers-header-card')).not.toBeInTheDocument();
    });
  });
});
