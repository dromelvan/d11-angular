import { Subject } from 'rxjs';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import type { Player, PlayerTransferContext } from '@app/core/api';
import { PlayerApiService } from '@app/core/api';
import { PlayerActionService } from '@app/core/auth/player-action.service';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayer, fakePlayerTransferContext } from '@app/test';
import { PlayerActionDrawerComponent } from './player-action-drawer.component';

describe('PlayerActionDrawerComponent', () => {
  let fixture: ComponentFixture<PlayerActionDrawerComponent>;
  let mockPlayerActionService: {
    drawerVisible: ReturnType<typeof signal<boolean>>;
    player: ReturnType<typeof signal<Player | undefined>>;
    isAdministrator: ReturnType<typeof signal<boolean>>;
    loggedIn: ReturnType<typeof signal<boolean>>;
    close: ReturnType<typeof vi.fn>;
  };
  let mockRouterService: { navigateToEditPlayer: ReturnType<typeof vi.fn> };
  let mockPlayerApiService: { getPlayerTransferContextByPlayerId: ReturnType<typeof vi.fn> };
  let transferContextSubject: Subject<PlayerTransferContext>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    vi.clearAllMocks();
    transferContextSubject = new Subject<PlayerTransferContext>();
    mockPlayerActionService = {
      drawerVisible: signal(false),
      player: signal<Player | undefined>(fakePlayer()),
      isAdministrator: signal(false),
      loggedIn: signal(false),
      close: vi.fn(),
    };
    mockPlayerApiService = {
      getPlayerTransferContextByPlayerId: vi.fn().mockReturnValue(transferContextSubject),
    };
    mockRouterService = { navigateToEditPlayer: vi.fn().mockResolvedValue(true) };
    user = userEvent.setup();

    await TestBed.configureTestingModule({
      imports: [PlayerActionDrawerComponent],
      providers: [
        { provide: PlayerActionService, useValue: mockPlayerActionService },
        { provide: PlayerApiService, useValue: mockPlayerApiService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerActionDrawerComponent);
    fixture.detectChanges();
    transferContextSubject.next({
      transferListable: false,
      maxBid: 0,
      deletableTransferListingId: undefined,
      activeTransferBid: undefined,
    });
    TestBed.tick();
  });

  it('does not show backdrop when drawer is closed', () => {
    expect(fixture.nativeElement.querySelector('div.fixed')).not.toBeInTheDocument();
  });

  it('shows backdrop when drawer is open', () => {
    mockPlayerActionService.drawerVisible.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('div.fixed')).toBeInTheDocument();
  });

  it('calls close() when backdrop is clicked', async () => {
    mockPlayerActionService.drawerVisible.set(true);
    fixture.detectChanges();

    await user.click(fixture.nativeElement.querySelector('div.fixed'));

    expect(mockPlayerActionService.close).toHaveBeenCalled();
  });

  it('shows player name in header when drawer is open', async () => {
    mockPlayerActionService.drawerVisible.set(true);
    fixture.detectChanges();
    TestBed.tick();

    expect(screen.getByText(mockPlayerActionService.player()!.name)).toBeInTheDocument();
  });

  it('calls close() when Done is clicked', async () => {
    mockPlayerActionService.drawerVisible.set(true);
    fixture.detectChanges();
    TestBed.tick();

    await user.click(screen.getByText('Done'));

    expect(mockPlayerActionService.close).toHaveBeenCalled();
  });

  // Edit player -----------------------------------------------------------------------------------

  describe('Edit player button', () => {
    it('is not shown when not administrator', async () => {
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.queryByText('Edit player')).not.toBeInTheDocument();
    });

    it('is shown when administrator', async () => {
      mockPlayerActionService.isAdministrator.set(true);
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.getByText('Edit player')).toBeInTheDocument();
    });

    it('closes drawer and navigates to edit player when clicked', async () => {
      const player = fakePlayer();
      mockPlayerActionService.player.set(player);
      mockPlayerActionService.isAdministrator.set(true);
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      await user.click(screen.getByText('Edit player'));

      expect(mockPlayerActionService.close).toHaveBeenCalled();
      expect(mockRouterService.navigateToEditPlayer).toHaveBeenCalledWith(player.id);
    });
  });

  // Add to shortlist -------------------------------------------------------------------------------

  describe('Add to shortlist button', () => {
    it('is not shown when not logged in', async () => {
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.queryByText('Add to shortlist')).not.toBeInTheDocument();
    });

    it('is shown when logged in', async () => {
      mockPlayerActionService.loggedIn.set(true);
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.getByText('Add to shortlist')).toBeInTheDocument();
    });

    it('closes drawer when clicked', async () => {
      mockPlayerActionService.loggedIn.set(true);
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      await user.click(screen.getByText('Add to shortlist'));

      expect(mockPlayerActionService.close).toHaveBeenCalled();
    });
  });

  // Add to transfer list ---------------------------------------------------------------------------

  describe('Add to transfer list button', () => {
    it('is not shown when transferListable is false', async () => {
      transferContextSubject.next({ ...fakePlayerTransferContext(), transferListable: false });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.queryByText('Add to transfer list')).not.toBeInTheDocument();
    });

    it('is shown when transferListable is true', async () => {
      transferContextSubject.next({ ...fakePlayerTransferContext(), transferListable: true });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.getByText('Add to transfer list')).toBeInTheDocument();
    });

    it('closes drawer when clicked', async () => {
      transferContextSubject.next({ ...fakePlayerTransferContext(), transferListable: true });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      await user.click(screen.getByText('Add to transfer list'));

      expect(mockPlayerActionService.close).toHaveBeenCalled();
    });
  });

  // Remove from transfer list ----------------------------------------------------------------------

  describe('Remove from transfer list button', () => {
    it('is not shown when deletableTransferListingId is null or undefined', async () => {
      transferContextSubject.next({
        ...fakePlayerTransferContext(),
        deletableTransferListingId: undefined,
      });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.queryByText('Remove from transfer list')).not.toBeInTheDocument();
    });

    it('is shown when deletableTransferListingId is set', async () => {
      transferContextSubject.next({
        ...fakePlayerTransferContext(),
        deletableTransferListingId: 1,
      });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.getByText('Remove from transfer list')).toBeInTheDocument();
    });

    it('closes drawer when clicked', async () => {
      transferContextSubject.next({
        ...fakePlayerTransferContext(),
        deletableTransferListingId: 1,
      });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      await user.click(screen.getByText('Remove from transfer list'));

      expect(mockPlayerActionService.close).toHaveBeenCalled();
    });
  });

  // Make transfer bid ------------------------------------------------------------------------------

  describe('Make transfer bid button', () => {
    it('is not shown when maxBid is 0', async () => {
      transferContextSubject.next({ ...fakePlayerTransferContext(), maxBid: 0 });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.queryByText('Make transfer bid')).not.toBeInTheDocument();
    });

    it('is shown when maxBid is greater than 0', async () => {
      transferContextSubject.next({ ...fakePlayerTransferContext(), maxBid: 10 });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.getByText('Make transfer bid')).toBeInTheDocument();
    });

    it('closes drawer when clicked', async () => {
      transferContextSubject.next({ ...fakePlayerTransferContext(), maxBid: 10 });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      await user.click(screen.getByText('Make transfer bid'));

      expect(mockPlayerActionService.close).toHaveBeenCalled();
    });
  });

  // Remove transfer bid ----------------------------------------------------------------------------

  describe('Remove transfer bid button', () => {
    it('is not shown when activeTransferBid is undefined', async () => {
      transferContextSubject.next({ ...fakePlayerTransferContext(), activeTransferBid: undefined });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.queryByText('Remove transfer bid')).not.toBeInTheDocument();
    });

    it('is shown when activeTransferBid is set', async () => {
      transferContextSubject.next({
        ...fakePlayerTransferContext(),
        activeTransferBid: { id: 1, fee: 100 },
      });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      expect(screen.getByText('Remove transfer bid')).toBeInTheDocument();
    });

    it('closes drawer when clicked', async () => {
      transferContextSubject.next({
        ...fakePlayerTransferContext(),
        activeTransferBid: { id: 1, fee: 100 },
      });
      TestBed.tick();
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      TestBed.tick();

      await user.click(screen.getByText('Remove transfer bid'));

      expect(mockPlayerActionService.close).toHaveBeenCalled();
    });
  });
});
