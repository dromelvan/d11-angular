import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { fakePlayer, fakePlayerTransferContext } from '@app/test';
import { UserActionService } from './user-action.service';
import { PlayerActionService } from './player-action.service';

describe('PlayerActionService', () => {
  let service: PlayerActionService;
  let mockUserActionService: { isAdministrator: ReturnType<typeof signal<boolean>> };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserActionService = { isAdministrator: signal(false) };

    TestBed.configureTestingModule({
      providers: [
        PlayerActionService,
        { provide: UserActionService, useValue: mockUserActionService },
      ],
    });

    service = TestBed.inject(PlayerActionService);
  });

  it('starts with drawer closed', () => {
    expect(service.drawerVisible()).toBe(false);
  });

  it('starts with player undefined', () => {
    expect(service.player()).toBeUndefined();
  });

  it('starts with transferContext undefined', () => {
    expect(service.transferContext()).toBeUndefined();
  });

  it('open() sets player, transferContext and shows drawer', () => {
    const player = fakePlayer();
    const transferContext = fakePlayerTransferContext();

    service.open(player, transferContext);

    expect(service.player()).toBe(player);
    expect(service.transferContext()).toBe(transferContext);
    expect(service.drawerVisible()).toBe(true);
  });

  it('open() without transferContext leaves transferContext undefined', () => {
    service.open(fakePlayer());

    expect(service.transferContext()).toBeUndefined();
    expect(service.drawerVisible()).toBe(true);
  });

  it('close() hides drawer and clears player and transferContext', () => {
    service.open(fakePlayer(), fakePlayerTransferContext());
    service.close();

    expect(service.drawerVisible()).toBe(false);
    expect(service.player()).toBeUndefined();
    expect(service.transferContext()).toBeUndefined();
  });

  // isAdministrator -------------------------------------------------------------------------------

  describe('isAdministrator', () => {
    it('is false when not administrator', () => {
      expect(service.isAdministrator()).toBe(false);
    });

    it('is true when administrator', () => {
      mockUserActionService.isAdministrator.set(true);
      expect(service.isAdministrator()).toBe(true);
    });
  });
});
