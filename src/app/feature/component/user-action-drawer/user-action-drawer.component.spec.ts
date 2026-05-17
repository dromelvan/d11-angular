import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { UserActionService } from '@app/core/auth/user-action.service';
import { RouterService } from '@app/core/router/router.service';
import { UserActionDrawerComponent } from './user-action-drawer.component';

describe('UserActionDrawerComponent', () => {
  let fixture: ComponentFixture<UserActionDrawerComponent>;
  let mockUserActionService: {
    drawerVisible: ReturnType<typeof signal<boolean>>;
    isAdministrator: ReturnType<typeof signal<boolean>>;
    close: ReturnType<typeof vi.fn>;
    onLogout: ReturnType<typeof vi.fn>;
  };
  let mockRouterService: { navigateToCreatePlayer: ReturnType<typeof vi.fn> };
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUserActionService = {
      drawerVisible: signal(false),
      isAdministrator: signal(false),
      close: vi.fn(),
      onLogout: vi.fn(),
    };
    mockRouterService = { navigateToCreatePlayer: vi.fn().mockResolvedValue(true) };
    user = userEvent.setup();

    await TestBed.configureTestingModule({
      imports: [UserActionDrawerComponent],
      providers: [
        { provide: UserActionService, useValue: mockUserActionService },
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
});
