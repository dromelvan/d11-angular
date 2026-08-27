import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { Status } from '@app/core/api/model/status.model';
import { UserActionService } from '@app/core/auth/user-action.service';
import { CurrentService } from '@app/core/current/current.service';
import { RouterService } from '@app/core/router/router.service';
import { fakeSeasonBase, fakeTransferWindowBase } from '@app/test';
import { UserActionDrawerComponent } from './user-action-drawer.component';

describe('UserActionDrawerComponent', () => {
  let fixture: ComponentFixture<UserActionDrawerComponent>;
  let mockUserActionService: {
    drawerVisible: ReturnType<typeof signal<boolean>>;
    isAdministrator: ReturnType<typeof signal<boolean>>;
    close: ReturnType<typeof vi.fn>;
    onLogout: ReturnType<typeof vi.fn>;
  };
  let mockCurrentService: {
    season: ReturnType<typeof signal>;
    transferWindow: ReturnType<typeof signal>;
  };
  let mockRouterService: {
    navigateToCreatePlayer: ReturnType<typeof vi.fn>;
    navigateToCreateTransferWindow: ReturnType<typeof vi.fn>;
  };
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUserActionService = {
      drawerVisible: signal(false),
      isAdministrator: signal(false),
      close: vi.fn(),
      onLogout: vi.fn(),
    };
    mockCurrentService = { season: signal(undefined), transferWindow: signal(undefined) };
    mockRouterService = {
      navigateToCreatePlayer: vi.fn().mockResolvedValue(true),
      navigateToCreateTransferWindow: vi.fn().mockResolvedValue(true),
    };
    user = userEvent.setup();

    await TestBed.configureTestingModule({
      imports: [UserActionDrawerComponent],
      providers: [
        { provide: UserActionService, useValue: mockUserActionService },
        { provide: CurrentService, useValue: mockCurrentService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserActionDrawerComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('does not show backdrop when drawer is closed', () => {
    expect(fixture.nativeElement.querySelector('div.fixed')).not.toBeInTheDocument();
  });

  it('shows backdrop when drawer is open', () => {
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('div.fixed')).toBeInTheDocument();
  });

  it('calls close() when backdrop is clicked', async () => {
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();

    await user.click(fixture.nativeElement.querySelector('div.fixed'));

    expect(mockUserActionService.close).toHaveBeenCalled();
  });

  it('calls close() when Done is clicked', async () => {
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    await user.click(screen.getByText('Done'));

    expect(mockUserActionService.close).toHaveBeenCalled();
  });

  it('calls onLogout() when Sign out is clicked', async () => {
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    await user.click(screen.getByText('Sign out'));

    expect(mockUserActionService.onLogout).toHaveBeenCalled();
  });

  it('does not show Add new player button when not administrator', async () => {
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(screen.queryByText('Add new player')).not.toBeInTheDocument();
  });

  it('shows Add new player button when administrator', async () => {
    mockUserActionService.isAdministrator.set(true);
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(screen.getByText('Add new player')).toBeInTheDocument();
  });

  it('closes drawer and navigates to create player when Add new player is clicked', async () => {
    mockUserActionService.isAdministrator.set(true);
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    await user.click(screen.getByText('Add new player'));

    expect(mockUserActionService.close).toHaveBeenCalled();
    expect(mockRouterService.navigateToCreatePlayer).toHaveBeenCalled();
  });

  it('does not show Create transfer window button when not administrator', async () => {
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(screen.queryByText('Create transfer window')).not.toBeInTheDocument();
  });

  it('shows Create transfer window button when administrator', async () => {
    mockUserActionService.isAdministrator.set(true);
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(screen.getByText('Create transfer window')).toBeInTheDocument();
  });

  it('disables Create transfer window button when current transfer window is not finished', async () => {
    const transferWindow = { ...fakeTransferWindowBase(), status: Status.ACTIVE };
    mockCurrentService.transferWindow.set(transferWindow);
    mockUserActionService.isAdministrator.set(true);
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(screen.getByText('Create transfer window').closest('button')).toBeDisabled();
  });

  it('enables Create transfer window button when season is active and transfer window is finished', async () => {
    mockCurrentService.season.set({ ...fakeSeasonBase(), status: Status.ACTIVE });
    mockCurrentService.transferWindow.set({ ...fakeTransferWindowBase(), status: Status.FINISHED });
    mockUserActionService.isAdministrator.set(true);
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(screen.getByText('Create transfer window').closest('button')).not.toBeDisabled();
  });

  it('disables Create transfer window button when season is not active', async () => {
    mockCurrentService.season.set({ ...fakeSeasonBase(), status: Status.FINISHED });
    mockCurrentService.transferWindow.set({ ...fakeTransferWindowBase(), status: Status.FINISHED });
    mockUserActionService.isAdministrator.set(true);
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(screen.getByText('Create transfer window').closest('button')).toBeDisabled();
  });

  it('disables Create transfer window button when there is no current season', async () => {
    mockCurrentService.season.set(undefined);
    mockCurrentService.transferWindow.set({ ...fakeTransferWindowBase(), status: Status.FINISHED });
    mockUserActionService.isAdministrator.set(true);
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(screen.getByText('Create transfer window').closest('button')).toBeDisabled();
  });

  it('disables Create transfer window button when there is no current transfer window', async () => {
    mockCurrentService.transferWindow.set(undefined);
    mockUserActionService.isAdministrator.set(true);
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(screen.getByText('Create transfer window').closest('button')).toBeDisabled();
  });

  it('closes drawer and navigates to create transfer window when button is clicked', async () => {
    mockCurrentService.season.set({ ...fakeSeasonBase(), status: Status.ACTIVE });
    mockCurrentService.transferWindow.set({ ...fakeTransferWindowBase(), status: Status.FINISHED });
    mockUserActionService.isAdministrator.set(true);
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    await user.click(screen.getByText('Create transfer window'));

    expect(mockUserActionService.close).toHaveBeenCalled();
    expect(mockRouterService.navigateToCreateTransferWindow).toHaveBeenCalled();
  });
});
