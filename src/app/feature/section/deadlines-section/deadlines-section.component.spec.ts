import { render, screen, waitFor } from '@testing-library/angular';
import { TransferWindow } from '@app/core/api';
import { fakeMatchWeekBase, fakeTransferDay, fakeTransferWindow } from '@app/test';
import { expect } from 'vitest';
import { DeadlinesSectionComponent } from './deadlines-section.component';

const template = `<app-deadlines-section [transferWindow]="transferWindow" />`;

describe('DeadlinesSectionComponent', () => {
  describe('with transfer window', () => {
    let transferWindow: TransferWindow;

    beforeEach(async () => {
      transferWindow = {
        ...fakeTransferWindow(),
        datetime: '2025-01-15T10:30:00.000Z',
        matchWeek: { ...fakeMatchWeekBase(), matchWeekNumber: 7 },
        transferDays: [{ ...fakeTransferDay(), datetime: '2025-01-20T18:00:00.000Z' }],
      };
      await render(template, {
        imports: [DeadlinesSectionComponent],
        componentProperties: { transferWindow },
      });
    });

    it('renders', () => {
      expect(document.querySelector('app-deadlines-section')).toBeInTheDocument();
    });

    it('renders transfer listing datetime', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Jan 15, 2025/, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders transfer bids datetime', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Jan 20, 2025/, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders match week number', () => {
      expect(screen.getByText(/Match week 7/, { exact: false })).toBeInTheDocument();
    });
  });

  describe('with no transfer window', () => {
    beforeEach(async () => {
      await render(template, {
        imports: [DeadlinesSectionComponent],
        componentProperties: { transferWindow: undefined },
      });
    });

    it('renders', () => {
      expect(document.querySelector('app-deadlines-section')).toBeInTheDocument();
    });
  });
});
