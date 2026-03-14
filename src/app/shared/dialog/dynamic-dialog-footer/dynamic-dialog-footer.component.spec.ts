import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  DialogFooterAction,
  DynamicDialogFooterComponent,
} from './dynamic-dialog-footer.component';
import { vi } from 'vitest';
import { signal } from '@angular/core';
import { fakePlayerMatchStat } from '@app/test';

function buildRef() {
  return { close: vi.fn() };
}

function buildProviders(action?: DialogFooterAction) {
  const current = signal(fakePlayerMatchStat());
  return [
    { provide: DynamicDialogRef, useValue: buildRef() },
    {
      provide: DynamicDialogConfig,
      useValue: { data: action ? { action, current } : { current } },
    },
  ];
}

describe('DynamicDialogFooterComponent', () => {
  describe('Done link', () => {
    it('renders', async () => {
      await render(DynamicDialogFooterComponent, { providers: buildProviders() });

      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('closes the dialog when clicked', async () => {
      const ref = buildRef();
      const current = signal(fakePlayerMatchStat());

      await render(DynamicDialogFooterComponent, {
        providers: [
          { provide: DynamicDialogRef, useValue: ref },
          { provide: DynamicDialogConfig, useValue: { data: { current } } },
        ],
      });
      await userEvent.click(screen.getByText('Done'));

      expect(ref.close).toHaveBeenCalled();
    });
  });

  describe('action', () => {
    it('is not rendered when not provided', async () => {
      await render(DynamicDialogFooterComponent, { providers: buildProviders() });

      expect(screen.queryByText(/view/i)).not.toBeInTheDocument();
    });

    it('renders the action label', async () => {
      await render(DynamicDialogFooterComponent, {
        providers: buildProviders({ label: 'View player', onClick: vi.fn() }),
      });

      expect(screen.getByText('View player')).toBeInTheDocument();
    });

    it('renders an icon when provided', async () => {
      await render(DynamicDialogFooterComponent, {
        providers: buildProviders({ label: 'View', icon: 'match', onClick: vi.fn() }),
      });

      expect(document.querySelector('app-icon')).toBeInTheDocument();
    });

    it('does not render an icon when not provided', async () => {
      await render(DynamicDialogFooterComponent, {
        providers: buildProviders({ label: 'View', onClick: vi.fn() }),
      });

      expect(document.querySelector('app-icon')).not.toBeInTheDocument();
    });

    it('calls onClick with current and closes the dialog when clicked', async () => {
      const onClick = vi.fn();
      const ref = buildRef();
      const stat = fakePlayerMatchStat();
      const current = signal(stat);

      await render(DynamicDialogFooterComponent, {
        providers: [
          { provide: DynamicDialogRef, useValue: ref },
          {
            provide: DynamicDialogConfig,
            useValue: { data: { current, action: { label: 'View player', onClick } } },
          },
        ],
      });
      await userEvent.click(screen.getByText('View player'));

      expect(onClick).toHaveBeenCalledWith(stat);
      expect(ref.close).toHaveBeenCalled();
    });
  });
});
