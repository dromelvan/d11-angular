import { render, screen } from '@testing-library/angular';
import { ICON_PRESETS, IconComponent } from './icon.component';

describe('IconComponent', () => {
  it('renders icon name as text content', async () => {
    await render(IconComponent, { inputs: { name: 'test' } });

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('applies material-symbols-outlined class', async () => {
    await render(IconComponent, { inputs: { name: 'test' } });

    expect(screen.getByText('test')).toHaveClass('material-symbols-outlined');
  });

  describe('font-variation-settings', () => {
    it('uses fill 0 and weight 400 by default', async () => {
      await render(IconComponent, { inputs: { name: 'test' } });

      expect(screen.getByText('test').style.fontVariationSettings).toBe(
        "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      );
    });

    it('applies fill when set', async () => {
      await render(IconComponent, { inputs: { name: 'test', fill: true } });

      expect(screen.getByText('test').style.fontVariationSettings).toBe(
        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      );
    });

    it('applies custom weight when set', async () => {
      await render(IconComponent, { inputs: { name: 'test', weight: 600 } });

      expect(screen.getByText('test').style.fontVariationSettings).toBe(
        "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24",
      );
    });
  });

  describe('icon preset', () => {
    it('renders icon preset name', async () => {
      await render(IconComponent, { inputs: { icon: 'test' } });

      expect(screen.getByText(ICON_PRESETS['test'].name)).toBeInTheDocument();
    });

    it('applies icon preset fill and weight', async () => {
      await render(IconComponent, { inputs: { icon: 'test' } });

      const { weight, size } = ICON_PRESETS['test'];
      expect(screen.getByText(ICON_PRESETS['test'].name).style.fontVariationSettings).toBe(
        `'FILL' 1, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      );
    });

    it('overrides icon preset fill when fill is set', async () => {
      await render(IconComponent, { inputs: { icon: 'test', fill: false } });

      const { weight, size } = ICON_PRESETS['test'];
      expect(screen.getByText(ICON_PRESETS['test'].name).style.fontVariationSettings).toBe(
        `'FILL' 0, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      );
    });

    it('overrides icon preset weight when weight is set', async () => {
      await render(IconComponent, { inputs: { icon: 'test', weight: 300 } });

      const { size } = ICON_PRESETS['test'];
      expect(screen.getByText(ICON_PRESETS['test'].name).style.fontVariationSettings).toBe(
        `'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' ${size}`,
      );
    });

    it('applies preset class', async () => {
      await render(IconComponent, { inputs: { icon: 'test' } });

      expect(screen.getByText(ICON_PRESETS['test'].name)).toHaveClass(ICON_PRESETS['test'].class!);
    });
  });

  describe('size', () => {
    it('uses 24px by default', async () => {
      await render(IconComponent, { inputs: { name: 'test' } });

      expect(screen.getByText('test')).toHaveStyle('font-size: 24px');
    });

    it('applies custom size', async () => {
      await render(IconComponent, { inputs: { name: 'test', size: 48 } });

      expect(screen.getByText('test')).toHaveStyle('font-size: 48px');
    });

    it('sets opsz to match size', async () => {
      await render(IconComponent, { inputs: { name: 'test', size: 48 } });

      expect(screen.getByText('test').style.fontVariationSettings).toContain("'opsz' 48");
    });

    it('applies preset size', async () => {
      await render(IconComponent, { inputs: { icon: 'test' } });

      expect(screen.getByText(ICON_PRESETS['test'].name)).toHaveStyle(
        `font-size: ${ICON_PRESETS['test'].size}px`,
      );
    });

    it('overrides preset size when size is set', async () => {
      await render(IconComponent, { inputs: { icon: 'test', size: 48 } });

      expect(screen.getByText(ICON_PRESETS['test'].name)).toHaveStyle('font-size: 48px');
    });
  });
});
