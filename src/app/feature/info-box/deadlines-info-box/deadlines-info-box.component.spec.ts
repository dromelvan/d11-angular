import { render, screen } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { TransferWindow } from '@app/core/api';
import { fakeMatchWeekBase, fakeTransferDay, fakeTransferWindow } from '@app/test';
import { describe, expect, it, beforeEach } from 'vitest';
import { DeadlinesInfoBoxComponent } from './deadlines-info-box.component';

describe('DeadlinesInfoBoxComponent', () => {
  describe('with transfer window', () => {
    beforeEach(async () => {
      const transferWindow: TransferWindow = {
        ...fakeTransferWindow(),
        datetime: '2025-01-15T10:30:00.000Z',
        matchWeek: { ...fakeMatchWeekBase(), matchWeekNumber: 7 },
        transferDays: [{ ...fakeTransferDay(), datetime: '2025-01-20T18:00:00.000Z' }],
      };
      await render(DeadlinesInfoBoxComponent, {
        inputs: { transferWindow },
      });
      TestBed.tick();
    });

    it('renders "DEADLINES" header', () => {
      expect(screen.getByText('DEADLINES')).toBeInTheDocument();
    });

    it('renders "Transfer listing" label', () => {
      expect(screen.getByText('Transfer listing')).toBeInTheDocument();
    });

    it('renders transfer listing datetime', () => {
      expect(screen.getByText(/Jan 15, 2025/)).toBeInTheDocument();
    });

    it('renders "Transfer bids" label', () => {
      expect(screen.getByText('Transfer bids')).toBeInTheDocument();
    });

    it('renders transfer bids datetime', () => {
      expect(screen.getByText(/Jan 20, 2025/)).toBeInTheDocument();
    });

    it('renders "AVAILABILITY" header', () => {
      expect(screen.getByText('AVAILABILITY')).toBeInTheDocument();
    });

    it('renders "Players available from" label', () => {
      expect(screen.getByText('Players available from')).toBeInTheDocument();
    });

    it('renders match week number', () => {
      expect(screen.getByText(/Match week 7/)).toBeInTheDocument();
    });
  });

  describe('with multiple transfer days', () => {
    beforeEach(async () => {
      const transferWindow: TransferWindow = {
        ...fakeTransferWindow(),
        datetime: '2025-01-15T10:30:00.000Z',
        transferDays: [
          { ...fakeTransferDay(), datetime: '2025-01-18T18:00:00.000Z' },
          { ...fakeTransferDay(), datetime: '2025-01-25T18:00:00.000Z' },
        ],
      };
      await render(DeadlinesInfoBoxComponent, {
        inputs: { transferWindow },
      });
      TestBed.tick();
    });

    it('renders transfer bids datetime from the last transfer day', () => {
      expect(screen.getByText(/Jan 25, 2025/)).toBeInTheDocument();
    });
  });

  describe('with no transfer window', () => {
    beforeEach(async () => {
      await render(DeadlinesInfoBoxComponent, {
        inputs: { transferWindow: undefined },
      });
      TestBed.tick();
    });

    it('renders section header without crashing', () => {
      expect(screen.getByText('DEADLINES')).toBeInTheDocument();
    });
  });
});
