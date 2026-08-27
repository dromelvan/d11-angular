import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import type { Player } from '@app/core/api';
import { PlayerActionService } from '@app/core/auth/player-action.service';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayer } from '@app/test';
import { PlayerActionDrawerComponent } from './player-action-drawer.component';

describe('PlayerActionDrawerComponent', () => {
  let fixture: ComponentFixture<PlayerActionDrawerComponent>;
  let mockPlayerActionService: {
    drawerVisible: ReturnType<typeof signal<boolean>>;
    player: ReturnType<typeof signal<Player | undefined>>;
    isAdministrator: ReturnType<typeof signal<boolean>>;
    close: ReturnType<typeof vi.fn>;
  };
  let mockRouterService: { navigateToEditPlayer: ReturnType<typeof vi.fn> };
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockPlayerActionService = {
      drawerVisible: signal(false),
      player: signal<Player | undefined>(fakePlayer()),
      isAdministrator: signal(false),
      close: vi.fn(),
    };
    mockRouterService = { navigateToEditPlayer: vi.fn().mockResolvedValue(true) };
    user = userEvent.setup();

    await TestBed.configureTestingModule({
      imports: [PlayerActionDrawerComponent],
      providers: [
        { provide: PlayerActionService, useValue: mockPlayerActionService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerActionDrawerComponent);
    fixture.detectChanges();
    await fixture.whenStable();
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
    await fixture.whenStable();

    expect(screen.getByText(mockPlayerActionService.player()!.name)).toBeInTheDocument();
  });

  it('calls close() when Done is clicked', async () => {
    mockPlayerActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    await user.click(screen.getByText('Done'));

    expect(mockPlayerActionService.close).toHaveBeenCalled();
  });

  // Edit player -----------------------------------------------------------------------------------

  describe('Edit player button', () => {
    it('is not shown when not administrator', async () => {
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(screen.queryByText('Edit player')).not.toBeInTheDocument();
    });

    it('is shown when administrator', async () => {
      mockPlayerActionService.isAdministrator.set(true);
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(screen.getByText('Edit player')).toBeInTheDocument();
    });

    it('closes drawer and navigates to edit player when clicked', async () => {
      const player = fakePlayer();
      mockPlayerActionService.player.set(player);
      mockPlayerActionService.isAdministrator.set(true);
      mockPlayerActionService.drawerVisible.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      await user.click(screen.getByText('Edit player'));

      expect(mockPlayerActionService.close).toHaveBeenCalled();
      expect(mockRouterService.navigateToEditPlayer).toHaveBeenCalledWith(player.id);
    });
  });
});
