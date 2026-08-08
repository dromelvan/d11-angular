import { signal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { HeroContainerComponent } from './hero-container.component';

function mockPageContextService(backgroundColor = '#ff0000', textClass = 'text-white') {
  return {
    backgroundColor: signal(backgroundColor),
    textClass: signal(textClass),
  };
}

describe('HeroContainerComponent', () => {
  it('renders heroContent slot', async () => {
    await render(
      `<app-hero-container><span heroContent>Hero slot content</span></app-hero-container>`,
      {
        imports: [HeroContainerComponent],
        providers: [{ provide: PageContextService, useValue: mockPageContextService() }],
      },
    );

    expect(screen.getByText('Hero slot content')).toBeInTheDocument();
  });

  it('renders card content slot', async () => {
    await render(`<app-hero-container><span>Card slot content</span></app-hero-container>`, {
      imports: [HeroContainerComponent],
      providers: [{ provide: PageContextService, useValue: mockPageContextService() }],
    });

    expect(screen.getByText('Card slot content')).toBeInTheDocument();
  });

  it('applies textClass from PageContextService to hero wrapper', async () => {
    await render(`<app-hero-container><span heroContent>Hero</span></app-hero-container>`, {
      imports: [HeroContainerComponent],
      providers: [
        { provide: PageContextService, useValue: mockPageContextService('#000000', 'text-white') },
      ],
    });

    expect(screen.getByText('Hero').closest('div')).toHaveClass('text-white');
  });

  it('applies background color from PageContextService to background div', async () => {
    const { container } = await render(`<app-hero-container></app-hero-container>`, {
      imports: [HeroContainerComponent],
      providers: [{ provide: PageContextService, useValue: mockPageContextService('#ff0000') }],
    });

    const backgroundDiv = container.querySelector('.app-hero-background') as HTMLElement;
    expect(backgroundDiv.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('uses default height of 17.5rem for background div', async () => {
    const { container } = await render(`<app-hero-container></app-hero-container>`, {
      imports: [HeroContainerComponent],
      providers: [{ provide: PageContextService, useValue: mockPageContextService() }],
    });

    const backgroundDiv = container.querySelector('.app-hero-background') as HTMLElement;
    expect(backgroundDiv.style.height).toBe('17.5rem');
  });

  it('applies custom height to background div', async () => {
    const { container } = await render(`<app-hero-container [height]="60"></app-hero-container>`, {
      imports: [HeroContainerComponent],
      providers: [{ provide: PageContextService, useValue: mockPageContextService() }],
    });

    const backgroundDiv = container.querySelector('.app-hero-background') as HTMLElement;
    expect(backgroundDiv.style.height).toBe('15rem');
  });
});
