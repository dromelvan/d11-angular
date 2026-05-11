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
  });
});
