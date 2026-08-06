import { render, screen } from '@testing-library/angular';
import { HeroContainerComponent } from './hero-container.component';

describe('HeroContainerComponent', () => {
  it('renders heroContent slot', async () => {
    await render(
      `<app-hero-container color="#ff0000" textClass="text-white">
        <span heroContent>Hero slot content</span>
       </app-hero-container>`,
      { imports: [HeroContainerComponent] },
    );

    expect(screen.getByText('Hero slot content')).toBeInTheDocument();
  });

  it('renders card content slot', async () => {
    await render(
      `<app-hero-container color="#ff0000" textClass="text-white">
        <span>Card slot content</span>
       </app-hero-container>`,
      { imports: [HeroContainerComponent] },
    );

    expect(screen.getByText('Card slot content')).toBeInTheDocument();
  });

  it('applies textClass to hero wrapper', async () => {
    await render(
      `<app-hero-container color="#ff0000" textClass="text-white">
        <span heroContent>Hero</span>
       </app-hero-container>`,
      { imports: [HeroContainerComponent] },
    );

    expect(screen.getByText('Hero').closest('div')).toHaveClass('text-white');
  });

  it('applies background color to background div', async () => {
    const { container } = await render(
      `<app-hero-container color="#ff0000" textClass="text-white"></app-hero-container>`,
      { imports: [HeroContainerComponent] },
    );

    const backgroundDiv = container.querySelector('.app-hero-background') as HTMLElement;
    expect(backgroundDiv.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('uses default height of 17.5rem for background div', async () => {
    const { container } = await render(
      `<app-hero-container color="#ff0000" textClass="text-white"></app-hero-container>`,
      { imports: [HeroContainerComponent] },
    );

    const backgroundDiv = container.querySelector('.app-hero-background') as HTMLElement;
    expect(backgroundDiv.style.height).toBe('17.5rem');
  });

  it('applies custom height to background div', async () => {
    const { container } = await render(
      `<app-hero-container color="#ff0000" textClass="text-white" [height]="60"></app-hero-container>`,
      { imports: [HeroContainerComponent] },
    );

    const backgroundDiv = container.querySelector('.app-hero-background') as HTMLElement;
    expect(backgroundDiv.style.height).toBe('15rem');
  });
});
