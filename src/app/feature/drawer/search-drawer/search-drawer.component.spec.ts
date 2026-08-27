import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerApiService, type PlayerSearchResult } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayerSearchResult } from '@app/test';
import { screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { Observable, of } from 'rxjs';
import { expect, vi } from 'vitest';
import { SearchDrawerComponent } from './search-drawer.component';

const mockPlayerApi = { search: vi.fn<(name: string) => Observable<PlayerSearchResult[]>>() };
const mockRouterService = { navigateToPlayer: vi.fn() };

describe('SearchDrawerComponent', () => {
  let fixture: ComponentFixture<SearchDrawerComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockPlayerApi.search.mockReturnValue(of<PlayerSearchResult[]>([]));
    await TestBed.configureTestingModule({
      imports: [SearchDrawerComponent],
      providers: [
        { provide: PlayerApiService, useValue: mockPlayerApi },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();
  });

  describe('visibility', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchDrawerComponent);
      fixture.detectChanges();
    });

    it('drawer is hidden initially', () => {
      const drawer = fixture.nativeElement.querySelector(
        '[data-testid="search-drawer"]',
      ) as HTMLElement;
      expect(drawer).toHaveClass('-translate-y-full');
    });

    it('open() makes the drawer visible', () => {
      fixture.componentInstance.open();
      fixture.detectChanges();

      const drawer = fixture.nativeElement.querySelector(
        '[data-testid="search-drawer"]',
      ) as HTMLElement;
      expect(drawer).not.toHaveClass('-translate-y-full');
      expect(drawer).toHaveClass('translate-y-0');
    });
  });

  describe('close', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchDrawerComponent);
      fixture.detectChanges();
      fixture.componentInstance.open();
      fixture.detectChanges();
    });

    it('Close button hides the drawer', async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));
      fixture.detectChanges();

      const drawer = fixture.nativeElement.querySelector(
        '[data-testid="search-drawer"]',
      ) as HTMLElement;
      expect(drawer).toHaveClass('-translate-y-full');
    });

    it('backdrop click hides the drawer', async () => {
      const backdrop = fixture.nativeElement.querySelector(
        '[data-testid="search-drawer-backdrop"]',
      ) as HTMLElement;
      await userEvent.click(backdrop);
      fixture.detectChanges();

      const drawer = fixture.nativeElement.querySelector(
        '[data-testid="search-drawer"]',
      ) as HTMLElement;
      expect(drawer).toHaveClass('-translate-y-full');
    });

    it('close clears the search input value', async () => {
      await userEvent.type(screen.getByPlaceholderText('Search players...'), 'test');
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));

      expect(screen.getByPlaceholderText('Search players...')).toHaveValue('');
    });
  });

  describe('renders', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchDrawerComponent);
      fixture.detectChanges();
    });

    it('renders the search input', () => {
      expect(screen.getByPlaceholderText('Search players...')).toBeInTheDocument();
    });

    it('does not render results', () => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    it('Close button has text-primary-contrast class', () => {
      const closeButton = screen.getByRole('button', { name: 'Close' });
      expect(closeButton).toHaveClass('text-primary-contrast');
    });
  });

  describe('short query', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchDrawerComponent);
      fixture.detectChanges();
    });

    it('does not search when query is shorter than 3 characters', async () => {
      await userEvent.type(screen.getByPlaceholderText('Search players...'), 'ab');

      expect(mockPlayerApi.search).not.toHaveBeenCalled();
    });
  });

  describe('search results', () => {
    let player: PlayerSearchResult;

    beforeEach(() => {
      player = fakePlayerSearchResult();
      mockPlayerApi.search.mockReturnValue(of([player]));
      fixture = TestBed.createComponent(SearchDrawerComponent);
      fixture.detectChanges();
    });

    it('searches when query is 3+ characters', async () => {
      await userEvent.type(
        screen.getByPlaceholderText('Search players...'),
        player.name.slice(0, 3),
      );

      await waitFor(() =>
        expect(mockPlayerApi.search).toHaveBeenCalledWith(player.name.slice(0, 3)),
      );
    });

    it('renders player name', async () => {
      await userEvent.type(
        screen.getByPlaceholderText('Search players...'),
        player.name.slice(0, 3),
      );

      await waitFor(() => expect(screen.getByText(player.name)).toBeInTheDocument());
    });

    it('renders team name', async () => {
      await userEvent.type(
        screen.getByPlaceholderText('Search players...'),
        player.name.slice(0, 3),
      );

      await waitFor(() => expect(screen.getByText(player.teamName)).toBeInTheDocument());
    });
  });

  describe('player without team', () => {
    let player: PlayerSearchResult;

    beforeEach(() => {
      player = { ...fakePlayerSearchResult(), teamId: 1 };
      mockPlayerApi.search.mockReturnValue(of([player]));
      fixture = TestBed.createComponent(SearchDrawerComponent);
      fixture.detectChanges();
    });

    it('does not render team name', async () => {
      await userEvent.type(
        screen.getByPlaceholderText('Search players...'),
        player.name.slice(0, 3),
      );

      await waitFor(() => screen.getByText(player.name));

      expect(screen.queryByText(player.teamName)).not.toBeInTheDocument();
    });
  });

  describe('player selection', () => {
    let player: PlayerSearchResult;

    beforeEach(() => {
      player = fakePlayerSearchResult();
      mockPlayerApi.search.mockReturnValue(of([player]));
      fixture = TestBed.createComponent(SearchDrawerComponent);
      fixture.detectChanges();
    });

    it('navigates to the selected player on click', async () => {
      await userEvent.type(
        screen.getByPlaceholderText('Search players...'),
        player.name.slice(0, 3),
      );

      await waitFor(() => screen.getByText(player.name));
      await userEvent.click(screen.getByText(player.name));

      expect(mockRouterService.navigateToPlayer).toHaveBeenCalledWith(player.id, undefined, false);
    });

    it('closes the drawer after selecting a player', async () => {
      fixture.componentInstance.open();
      fixture.detectChanges();

      await userEvent.type(
        screen.getByPlaceholderText('Search players...'),
        player.name.slice(0, 3),
      );

      await waitFor(() => screen.getByText(player.name));
      await userEvent.click(screen.getByText(player.name));
      fixture.detectChanges();

      const drawer = fixture.nativeElement.querySelector(
        '[data-testid="search-drawer"]',
      ) as HTMLElement;
      expect(drawer).toHaveClass('-translate-y-full');
    });
  });
});
