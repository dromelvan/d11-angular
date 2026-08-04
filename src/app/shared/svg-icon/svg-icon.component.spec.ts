import { render } from '@testing-library/angular';
import { SvgIconComponent } from './svg-icon.component';

describe('SvgIconComponent', () => {
  it('renders an svg element', async () => {
    const { container } = await render(SvgIconComponent, { inputs: { name: 'search' } });

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('sets standard svg attributes', async () => {
    const { container } = await render(SvgIconComponent, { inputs: { name: 'search' } });
    const svg = container.querySelector('svg')!;

    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });

  describe('size', () => {
    it('applies md size class by default', async () => {
      const { container } = await render(SvgIconComponent, { inputs: { name: 'search' } });

      expect(container.querySelector('svg')).toHaveClass('w-6', 'h-6');
    });

    it('applies sm size class', async () => {
      const { container } = await render(SvgIconComponent, {
        inputs: { name: 'search', size: 'sm' },
      });

      expect(container.querySelector('svg')).toHaveClass('w-4', 'h-4');
    });

    it('applies lg size class', async () => {
      const { container } = await render(SvgIconComponent, {
        inputs: { name: 'search', size: 'lg' },
      });

      expect(container.querySelector('svg')).toHaveClass('w-7', 'h-7');
    });
  });

  describe('chevron-left', () => {
    it('renders the chevron-left path', async () => {
      const { container } = await render(SvgIconComponent, { inputs: { name: 'chevron-left' } });

      expect(container.querySelector('path[d="M15 18l-6-6 6-6"]')).toBeInTheDocument();
    });
  });

  describe('chevron-right', () => {
    it('renders the chevron-right path', async () => {
      const { container } = await render(SvgIconComponent, { inputs: { name: 'chevron-right' } });

      expect(container.querySelector('path[d="M9 18l6-6-6-6"]')).toBeInTheDocument();
    });
  });

  describe('search', () => {
    it('renders the search circle and line', async () => {
      const { container } = await render(SvgIconComponent, { inputs: { name: 'search' } });

      expect(container.querySelector('circle[cx="11"][cy="11"][r="7"]')).toBeInTheDocument();
      expect(container.querySelector('path[d="M20 20l-3.5-3.5"]')).toBeInTheDocument();
    });
  });

  describe('person', () => {
    it('renders the person head and body', async () => {
      const { container } = await render(SvgIconComponent, { inputs: { name: 'person' } });

      expect(container.querySelector('circle[cx="12"][cy="8"][r="4"]')).toBeInTheDocument();
      expect(container.querySelector('path[d="M4 20c0-4 3.6-7 8-7s8 3 8 7"]')).toBeInTheDocument();
    });
  });
});
