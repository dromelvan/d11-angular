import { render, screen } from '@testing-library/angular';
import { ICON_PRESETS } from '@app/shared/icon/icon.component';
import { IconButtonComponent } from './icon-button.component';

describe('IconButtonComponent', () => {
  it('renders', async () => {
    await render(IconButtonComponent, { inputs: { icon: 'test' } });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders the icon', async () => {
    await render(IconButtonComponent, { inputs: { icon: 'test' } });

    expect(screen.getByText(ICON_PRESETS['test'].name)).toBeInTheDocument();
  });

  describe('severity', () => {
    it('applies default', async () => {
      await render(IconButtonComponent, { inputs: { icon: 'test' } });

      expect(screen.getByRole('button')).toHaveClass('p-button-primary');
    });

    it('applies secondary', async () => {
      await render(IconButtonComponent, { inputs: { icon: 'test', severity: 'secondary' } });

      expect(screen.getByRole('button')).toHaveClass('p-button-secondary');
    });
  });

  describe('disabled', () => {
    it('applies default', async () => {
      await render(IconButtonComponent, { inputs: { icon: 'test' } });

      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('applies provided', async () => {
      await render(IconButtonComponent, { inputs: { icon: 'test', disabled: true } });

      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('variant', () => {
    it('applies no variant by default', async () => {
      await render(IconButtonComponent, { inputs: { icon: 'test' } });

      expect(screen.getByRole('button')).not.toHaveClass('p-button-text');
      expect(screen.getByRole('button')).not.toHaveClass('p-button-outlined');
    });

    it('applies text variant', async () => {
      await render(IconButtonComponent, { inputs: { icon: 'test', variant: 'text' } });

      expect(screen.getByRole('button')).toHaveClass('p-button-text');
    });

    it('applies outlined variant', async () => {
      await render(IconButtonComponent, { inputs: { icon: 'test', variant: 'outlined' } });

      expect(screen.getByRole('button')).toHaveClass('p-button-outlined');
    });
  });

  describe('iconClass', () => {
    it('applies class to icon', async () => {
      await render(IconButtonComponent, { inputs: { icon: 'test', iconClass: 'foo' } });

      expect(document.querySelector('app-icon')).toHaveClass('foo');
    });
  });
});
