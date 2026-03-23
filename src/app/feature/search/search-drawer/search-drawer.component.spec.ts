import { Component } from '@angular/core';
import { PlayerApiService, type PlayerSearchResult } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayerSearchResult } from '@app/test';
import { render, screen, waitFor } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { of } from 'rxjs';
import { expect, vi } from 'vitest';
import { SearchDrawerComponent } from './search-drawer.component';

let players: PlayerSearchResult[];

@Component({
  template: ` <app-search-drawer />`,
  standalone: true,
  imports: [SearchDrawerComponent],
})
class HostComponent {}

const mockPlayerApi = { search: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

const providers = [
  { provide: PlayerApiService, useValue: mockPlayerApi },
  { provide: RouterService, useValue: mockRouterService },
];

describe('SearchDrawerComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPlayerApi.search.mockReturnValue(of(players));
  });

  describe('renders', () => {
    beforeEach(async () => {
      players = [];
      await render(HostComponent, { providers });
    });

    it('renders the search input', () => {
      expect(screen.getByPlaceholderText('Search players...')).toBeInTheDocument();
    });

    it('does not render results', () => {
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });

  describe('short query', () => {
    beforeEach(async () => {
      players = [];
      await render(HostComponent, { providers });
    });

    it('does not search when query is shorter than 3 characters', async () => {
      await userEvent.type(screen.getByPlaceholderText('Search players...'), 'ab');

      expect(mockPlayerApi.search).not.toHaveBeenCalled();
    });
  });

  describe('search results', () => {
    let player: PlayerSearchResult;

    beforeEach(async () => {
      player = fakePlayerSearchResult();
      players = [player];
      mockPlayerApi.search.mockReturnValue(of(players));
      await render(HostComponent, { providers });
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

    beforeEach(async () => {
      player = { ...fakePlayerSearchResult(), teamId: 1 };
      players = [player];
      mockPlayerApi.search.mockReturnValue(of(players));
      await render(HostComponent, { providers });
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

    beforeEach(async () => {
      player = fakePlayerSearchResult();
      players = [player];
      mockPlayerApi.search.mockReturnValue(of(players));
      await render(HostComponent, { providers });
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
