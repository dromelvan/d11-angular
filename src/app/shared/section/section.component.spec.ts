import { render, screen } from '@testing-library/angular';
import { SectionComponent } from './section.component';

describe('SectionComponent', () => {
  it('renders header content', async () => {
    await render(
      `<app-section><span sectionHeader>My Header</span><div>Content</div></app-section>`,
      { imports: [SectionComponent] },
    );

    expect(screen.getByText('My Header')).toBeInTheDocument();
  });

  it('renders body content', async () => {
    await render(
      `<app-section><span sectionHeader>Header</span><div>My Content</div></app-section>`,
      { imports: [SectionComponent] },
    );

    expect(screen.getByText('My Content')).toBeInTheDocument();
  });

  it('renders header outside the bordered container', async () => {
    const { container } = await render(
      `<app-section><span sectionHeader>Header</span><div>Content</div></app-section>`,
      { imports: [SectionComponent] },
    );

    expect(container.querySelector('.rounded-2xl')).not.toContainElement(
      screen.getByText('Header') as HTMLElement,
    );
  });

  it('renders body content inside the bordered container', async () => {
    const { container } = await render(
      `<app-section><span sectionHeader>Header</span><div>Content</div></app-section>`,
      { imports: [SectionComponent] },
    );

    expect(container.querySelector('.rounded-2xl')).toContainElement(
      screen.getByText('Content') as HTMLElement,
    );
  });

  it('projects multiple header elements into the header wrapper', async () => {
    const { container } = await render(
      `<app-section>
        <img sectionHeader src="/icon.png" alt="icon" />
        <span sectionHeader>Team Name</span>
        <div>Content</div>
      </app-section>`,
      { imports: [SectionComponent] },
    );

    const headerWrapper = container.querySelector('[data-testid="section-header"]')!;
    expect(headerWrapper.querySelector('img')).toBeInTheDocument();
    expect(headerWrapper).toContainElement(screen.getByText('Team Name') as HTMLElement);
  });
});
