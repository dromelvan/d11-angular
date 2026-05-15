import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { userEvent } from '@testing-library/user-event';
import { UserActionService } from '@app/core/auth/user-action.service';
import { UserActionDrawerComponent } from './user-action-drawer.component';

describe('UserActionDrawerComponent', () => {
  let fixture: ComponentFixture<UserActionDrawerComponent>;
  let mockUserActionService: {
    drawerVisible: ReturnType<typeof signal<boolean>>;
    close: ReturnType<typeof vi.fn>;
    onLogout: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUserActionService = {
      drawerVisible: signal(false),
      close: vi.fn(),
      onLogout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UserActionDrawerComponent],
      providers: [{ provide: UserActionService, useValue: mockUserActionService }],
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

    await userEvent.click(fixture.nativeElement.querySelector('div.fixed'));

    expect(mockUserActionService.close).toHaveBeenCalled();
  });

  it('calls close() when Done is clicked', async () => {
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    await userEvent.click(document.body.querySelector('a') as HTMLAnchorElement);

    expect(mockUserActionService.close).toHaveBeenCalled();
  });

  it('calls onLogout() when sign out is clicked', async () => {
    mockUserActionService.drawerVisible.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    await userEvent.click(document.body.querySelector('button') as HTMLButtonElement);

    expect(mockUserActionService.onLogout).toHaveBeenCalled();
  });
});
