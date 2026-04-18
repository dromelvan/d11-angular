import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { NavbarLinkComponent } from './navbar-link.component';

describe('NavbarLinkComponent', () => {
  let fixture: ComponentFixture<NavbarLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarLinkComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarLinkComponent);
    fixture.detectChanges();
  });

  it('renders', () => {
    expect(fixture.nativeElement.querySelector('nav')).toBeInTheDocument();
    expect(fixture.nativeElement.querySelector('nav')).toHaveClass('hidden lg:flex');
  });

  it('renders Matches link to /match-weeks', () => {
    expect(screen.getByRole('link', { name: 'Matches' })).toHaveAttribute('href', '/match-weeks');
  });

  it('renders Tables link to /seasons', () => {
    expect(screen.getByRole('link', { name: 'Tables' })).toHaveAttribute('href', '/seasons');
  });

  it('renders Players link to /players', () => {
    expect(screen.getByRole('link', { name: 'Players' })).toHaveAttribute('href', '/players');
  });

  it('renders Transfers link to /transfers', () => {
    expect(screen.getByRole('link', { name: 'Transfers' })).toHaveAttribute('href', '/transfers');
  });

  it('renders More dropdown trigger with chevron', () => {
    const more = screen.getByRole('link', { name: /More/i });
    expect(more).toBeInTheDocument();
    expect(more.querySelector('.pi-chevron-down')).toBeInTheDocument();
  });

  describe('More dropdown', () => {
    beforeEach(async () => {
      await userEvent.click(screen.getByRole('link', { name: /More/i }));
    });

    it('renders D11 Teams as a link to /d11-teams', async () => {
      await waitFor(() =>
        expect(screen.getByRole('link', { name: /D11 Teams/i })).toHaveAttribute(
          'href',
          '/d11-teams',
        ),
      );
    });

    it('renders Rules as a link to /rules', async () => {
      await waitFor(() =>
        expect(screen.getByRole('link', { name: /Rules/i })).toHaveAttribute('href', '/rules'),
      );
    });

    it('renders History without a link', async () => {
      await waitFor(() => expect(screen.getByText('History')).toBeInTheDocument());
      expect(screen.queryByRole('link', { name: /History/i })).not.toBeInTheDocument();
    });

    it('renders Statistics without a link', async () => {
      await waitFor(() => expect(screen.getByText('Statistics')).toBeInTheDocument());
      expect(screen.queryByRole('link', { name: /Statistics/i })).not.toBeInTheDocument();
    });

    it('renders About without a link', async () => {
      await waitFor(() => expect(screen.getByText('About')).toBeInTheDocument());
      expect(screen.queryByRole('link', { name: /About/i })).not.toBeInTheDocument();
    });
  });
});
