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
    expect(svg).toHaveAttribute('stroke-width', '1.5');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('stroke-linejoin', 'round');
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

  describe('chevrons-left', () => {
    it('renders the chevrons-left paths', async () => {
      const { container } = await render(SvgIconComponent, { inputs: { name: 'chevrons-left' } });

      expect(container.querySelector('path[d="M11 18l-5-6 5-6"]')).toBeInTheDocument();
      expect(container.querySelector('path[d="M17 18l-5-6 5-6"]')).toBeInTheDocument();
    });
  });

  describe('chevrons-right', () => {
    it('renders the chevrons-right paths', async () => {
      const { container } = await render(SvgIconComponent, { inputs: { name: 'chevrons-right' } });

      expect(container.querySelector('path[d="M7 18l5-6-5-6"]')).toBeInTheDocument();
      expect(container.querySelector('path[d="M13 18l5-6-5-6"]')).toBeInTheDocument();
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

  describe('more-vertical', () => {
    it('renders three circles', async () => {
      const { container } = await render(SvgIconComponent, { inputs: { name: 'more-vertical' } });

      expect(container.querySelector('circle[cx="12"][cy="5"][r="1"]')).toBeInTheDocument();
      expect(container.querySelector('circle[cx="12"][cy="12"][r="1"]')).toBeInTheDocument();
      expect(container.querySelector('circle[cx="12"][cy="19"][r="1"]')).toBeInTheDocument();
    });
  });

  describe('shield', () => {
    it('renders the shield path', async () => {
      const { container } = await render(SvgIconComponent, { inputs: { name: 'shield' } });

      expect(
        container.querySelector(
          'path[d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z"]',
        ),
      ).toBeInTheDocument();
    });
  });
});
