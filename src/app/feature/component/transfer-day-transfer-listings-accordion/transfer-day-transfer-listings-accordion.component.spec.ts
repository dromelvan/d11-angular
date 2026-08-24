import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { NEVER, Observable, of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TransferListing, TransferListingApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import {
  fakeD11TeamBase,
  fakePlayerBase,
  fakePosition,
  fakeTeamBase,
  fakeTransferListing,
} from '@app/test';
import { provideRouter } from '@angular/router';
import { TransferDayTransferListingsAccordionComponent } from './transfer-day-transfer-listings-accordion.component';

const fakeListing = (overrides: Partial<TransferListing> = {}): TransferListing => ({
  ...fakeTransferListing(),
  goals: 0,
  goalAssists: 0,
  ownGoals: 0,
  cleanSheets: 0,
  goalsConceded: 0,
  yellowCards: 0,
  redCards: 0,
  manOfTheMatch: 0,
  sharedManOfTheMatch: 0,
  gamesSubstitute: 0,
  gamesDidNotParticipate: 0,
  rating: 0,
  team: { ...fakeTeamBase(), dummy: false },
  d11Team: { ...fakeD11TeamBase(), dummy: false },
  ...overrides,
});

const mockTransferListingApi = {
  getTransferListingsByTransferDayId:
    vi.fn<(id: number, page?: number, dummy?: boolean) => Observable<TransferListing[]>>(),
};

const providers = [{ provide: TransferListingApiService, useValue: mockTransferListingApi }];

describe('TransferDayTransferListingsAccordionComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([]));
  });

  it('calls the API with the provided transferDayId', async () => {
    await render(TransferDayTransferListingsAccordionComponent, {
      inputs: { transferDayId: 7 },
      providers,
    });
    TestBed.tick();

    expect(mockTransferListingApi.getTransferListingsByTransferDayId).toHaveBeenCalledWith(
      7,
      undefined,
      false,
    );
  });

  it('shows spinner while loading', async () => {
    mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(NEVER);

    const { container } = await render(TransferDayTransferListingsAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelector('p-progress-spinner')).toBeInTheDocument();
  });

  it('hides spinner when data loads', async () => {
    const { container } = await render(TransferDayTransferListingsAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelector('p-progress-spinner')).not.toBeInTheDocument();
  });

  it('renders column headers', async () => {
    await render(TransferDayTransferListingsAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('Player')).toBeInTheDocument();
    expect(screen.getByText('D11 Team / # / Pts')).toBeInTheDocument();
  });

  it('renders player names in accordion header', async () => {
    const listing1 = { ...fakeListing(), player: { ...fakePlayerBase(), name: 'Player1' } };
    const listing2 = { ...fakeListing(), player: { ...fakePlayerBase(), name: 'Player2' } };
    mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(
      of([listing1, listing2]),
    );

    await render(TransferDayTransferListingsAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('Player1')).toBeInTheDocument();
    expect(screen.getByText('Player2')).toBeInTheDocument();
  });

  it('renders position and team short name in accordion header', async () => {
    const listing = {
      ...fakeListing(),
      position: { ...fakePosition(), name: 'Midfielder' },
      team: { ...fakeTeamBase(), dummy: false, shortName: 'MCI' },
    };
    mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

    await render(TransferDayTransferListingsAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('Midfielder - MCI')).toBeInTheDocument();
  });

  it('renders D11 team name in accordion header', async () => {
    const listing = {
      ...fakeListing(),
      d11Team: { ...fakeD11TeamBase(), dummy: true, name: 'HeaderTeam' },
    };
    mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

    await render(TransferDayTransferListingsAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('HeaderTeam')).toBeInTheDocument();
  });

  it('renders ranking and points in accordion header', async () => {
    const listing = { ...fakeListing(), ranking: 3, points: 42 };
    mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

    await render(TransferDayTransferListingsAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(screen.getByText('#3 / 42 pts')).toBeInTheDocument();
  });

  it('renders separators between listings', async () => {
    mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(
      of([fakeListing(), fakeListing(), fakeListing()]),
    );

    const { container } = await render(TransferDayTransferListingsAccordionComponent, {
      inputs: { transferDayId: 1 },
      providers,
    });
    TestBed.tick();

    expect(container.querySelectorAll('.app-separator').length).toBe(2);
  });

  describe('accordion content', () => {
    it('renders Team when team is not dummy', async () => {
      const listing = {
        ...fakeListing(),
        team: { ...fakeTeamBase(), dummy: false, name: 'Chelsea' },
      };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Team')).toBeInTheDocument();
      expect(screen.getAllByText('Chelsea').length).toBeGreaterThan(0);
    });

    it('does not render Team when team is dummy', async () => {
      const listing = { ...fakeListing(), team: { ...fakeTeamBase(), dummy: true } };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.queryByText('Team')).not.toBeInTheDocument();
    });

    it('renders D11 team when d11Team is not dummy', async () => {
      const listing = {
        ...fakeListing(),
        d11Team: { ...fakeD11TeamBase(), dummy: false, name: 'Arsenal' },
      };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('D11 team')).toBeInTheDocument();
    });

    it('does not render D11 team label when d11Team is dummy', async () => {
      const listing = { ...fakeListing(), d11Team: { ...fakeD11TeamBase(), dummy: true } };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.queryByText('D11 team')).not.toBeInTheDocument();
    });

    it('renders Rating when rating is greater than 0', async () => {
      const listing = { ...fakeListing(), rating: 750 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Rating')).toBeInTheDocument();
    });

    it('does not render Rating when rating is 0', async () => {
      const listing = { ...fakeListing(), rating: 0 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.queryByText('Rating')).not.toBeInTheDocument();
    });

    it('renders Points', async () => {
      const listing = { ...fakeListing(), points: 57 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Points')).toBeInTheDocument();
      expect(screen.getAllByText('57').length).toBeGreaterThan(0);
    });

    it('renders Goals when goals is greater than 0', async () => {
      const listing = { ...fakeListing(), goals: 8 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Goals')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('renders Assists when goalAssists is greater than 0', async () => {
      const listing = { ...fakeListing(), goalAssists: 5 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Assists')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders Own goals when ownGoals is greater than 0', async () => {
      const listing = { ...fakeListing(), ownGoals: 1 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Own goals')).toBeInTheDocument();
    });

    it('renders Clean sheets when cleanSheets is greater than 0 and position.id is less than 5', async () => {
      const listing = {
        ...fakeListing(),
        cleanSheets: 4,
        position: { ...fakePosition(), id: 3 },
      };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Clean sheets')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('does not render Clean sheets when position.id is 5 or greater', async () => {
      const listing = {
        ...fakeListing(),
        cleanSheets: 4,
        position: { ...fakePosition(), id: 5 },
      };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.queryByText('Clean sheets')).not.toBeInTheDocument();
    });

    it('renders Goals conceded when goalsConceded is greater than 0 and position is defender', async () => {
      const listing = {
        ...fakeListing(),
        goalsConceded: 3,
        position: { ...fakePosition(), defender: true },
      };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Goals conceded')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('does not render Goals conceded when position is not defender', async () => {
      const listing = {
        ...fakeListing(),
        goalsConceded: 3,
        position: { ...fakePosition(), defender: false },
      };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.queryByText('Goals conceded')).not.toBeInTheDocument();
    });

    it('renders Yellow cards when yellowCards is greater than 0', async () => {
      const listing = { ...fakeListing(), yellowCards: 2 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Yellow cards')).toBeInTheDocument();
    });

    it('renders Red cards when redCards is greater than 0', async () => {
      const listing = { ...fakeListing(), redCards: 1 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Red cards')).toBeInTheDocument();
    });

    it('renders Man of the match when manOfTheMatch is greater than 0', async () => {
      const listing = { ...fakeListing(), manOfTheMatch: 2 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Man of the match')).toBeInTheDocument();
    });

    it('renders Shared man of the match when sharedManOfTheMatch is greater than 0', async () => {
      const listing = { ...fakeListing(), sharedManOfTheMatch: 1 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Shared man of the match')).toBeInTheDocument();
    });

    it('renders Games started', async () => {
      const listing = { ...fakeListing(), gamesStarted: 12 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Games started')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('renders Games substitute when gamesSubstitute is greater than 0', async () => {
      const listing = { ...fakeListing(), gamesSubstitute: 6 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Games substitute')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('renders Games DNP when gamesDidNotParticipate is greater than 0', async () => {
      const listing = { ...fakeListing(), gamesDidNotParticipate: 3 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Games DNP')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders Minutes played', async () => {
      const listing = { ...fakeListing(), minutesPlayed: 900 };
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Minutes played')).toBeInTheDocument();
      expect(screen.getByText('900')).toBeInTheDocument();
    });

    it('renders Form', async () => {
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(
        of([fakeListing()]),
      );

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers,
      });
      TestBed.tick();

      expect(screen.getByText('Form')).toBeInTheDocument();
    });

    it('renders Player profile button', async () => {
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(
        of([fakeListing()]),
      );

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers: [...providers, provideRouter([])],
      });
      TestBed.tick();

      expect(screen.getByText('Player profile')).toBeInTheDocument();
    });

    it('navigates to player when Player profile button is clicked', async () => {
      const routerService = { navigateToPlayer: vi.fn() };
      const listing = fakeListing();
      mockTransferListingApi.getTransferListingsByTransferDayId.mockReturnValue(of([listing]));

      await render(TransferDayTransferListingsAccordionComponent, {
        inputs: { transferDayId: 1 },
        providers: [
          ...providers,
          provideRouter([]),
          { provide: RouterService, useValue: routerService },
        ],
      });
      TestBed.tick();

      await userEvent.click(screen.getByText('Player profile'));

      expect(routerService.navigateToPlayer).toHaveBeenCalledWith(listing.player.id);
    });
  });
});
