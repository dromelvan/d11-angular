import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { APP_VERSION } from '@app/version';
import { FooterComponent } from './footer.component';

@Component({
  template: ` <app-footer data-testid="footer" /> `,
  standalone: true,
  imports: [FooterComponent],
})
class HostComponent {}

describe('FooterComponent', () => {
  it('renders', async () => {
    await render(HostComponent, {});

    const component = screen.getByTestId('footer');

    expect(component).toBeInTheDocument();

    const footer = component.querySelector('footer.app-footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('max-sm:fixed');

    const infoFooter = footer?.querySelector('div.app-info-footer');
    expect(infoFooter).toBeInTheDocument();
    expect(infoFooter).toHaveClass('hidden lg:flex');

    const version = infoFooter?.querySelector('span#version');
    expect(version).toBeInTheDocument();
    expect(version).toHaveTextContent(`D11 ${APP_VERSION}`);

    const links = infoFooter?.querySelector('span#links');
    expect(links).toBeInTheDocument();

    const navbarIcon = component.querySelector('app-navbar-icon');
    expect(navbarIcon).toBeInTheDocument();
  });
});
