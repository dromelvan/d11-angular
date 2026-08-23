import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { InfoBoxComponent } from './info-box.component';

describe('InfoBoxComponent', () => {
  it('renders content', async () => {
    await render(`<app-info-box><div>My Content</div></app-info-box>`, {
      imports: [InfoBoxComponent],
    });

    expect(screen.getByText('My Content')).toBeInTheDocument();
  });

  it('applies base host classes', async () => {
    const { container } = await render(`<app-info-box></app-info-box>`, {
      imports: [InfoBoxComponent],
    });

    expect(container.querySelector('app-info-box')).toHaveClass('app-col', 'rounded-2xl', 'p-4');
  });

  describe('non-primary (default)', () => {
    it('applies surface background and border', async () => {
      const { container } = await render(`<app-info-box></app-info-box>`, {
        imports: [InfoBoxComponent],
      });

      const host = container.querySelector('app-info-box')!;
      expect(host).toHaveClass('bg-surface-0', 'border', 'border-neutral-300');
    });

    it('does not apply primary background', async () => {
      const { container } = await render(`<app-info-box></app-info-box>`, {
        imports: [InfoBoxComponent],
      });

      expect(container.querySelector('app-info-box')).not.toHaveClass('bg-primary');
    });
  });

  describe('primary', () => {
    it('applies primary background and contrast text', async () => {
      const { container } = await render(`<app-info-box primary></app-info-box>`, {
        imports: [InfoBoxComponent],
      });

      const host = container.querySelector('app-info-box')!;
      expect(host).toHaveClass('bg-primary', 'text-primary-contrast');
    });

    it('does not apply surface background or border', async () => {
      const { container } = await render(`<app-info-box primary></app-info-box>`, {
        imports: [InfoBoxComponent],
      });

      const host = container.querySelector('app-info-box')!;
      expect(host).not.toHaveClass('bg-surface-0', 'border');
    });
  });
});
