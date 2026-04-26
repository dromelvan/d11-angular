import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { screen } from '@testing-library/angular';
import { beforeEach, describe, expect, vi } from 'vitest';
import { CurrentApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeCurrent } from '@app/test';
import { NavbarIconComponent } from './navbar-icon.component';

describe('NavbarIconComponent', () => {
  let fixture: ComponentFixture<NavbarIconComponent>;
  const current = fakeCurrent();

  const mockRouterService = {
    navigateToMatchWeek: vi.fn(),
    navigateToSeason: vi.fn(),
    navigateToPlayers: vi.fn(),
    navigateToTransferWindow: vi.fn(),
    navigateToMore: vi.fn(),
  };

  const mockCurrentApiService = {
    getCurrent: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCurrentApiService.getCurrent.mockReturnValue(of(current));

    await TestBed.configureTestingModule({
      imports: [NavbarIconComponent],
      providers: [
        { provide: RouterService, useValue: mockRouterService },
        { provide: CurrentApiService, useValue: mockCurrentApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarIconComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders nav', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('lg:hidden');
  });

  it('renders Matches link', () => {
    expect(screen.getByText('Matches')).toBeInTheDocument();
  });

  it('calls navigateToMatchWeek with current match week id on Matches click', () => {
    screen.getByText('Matches').click();

    expect(mockRouterService.navigateToMatchWeek).toHaveBeenCalledExactlyOnceWith(
      current.matchWeek!.id,
    );
  });

  it('renders Tables link', () => {
    expect(screen.getByText('Tables')).toBeInTheDocument();
  });

  it('calls navigateToSeason with current season id on Tables click', () => {
    screen.getByText('Tables').click();

    expect(mockRouterService.navigateToSeason).toHaveBeenCalledExactlyOnceWith(current.season!.id);
  });

  it('renders Players link', () => {
    expect(screen.getByText('Players')).toBeInTheDocument();
  });

  it('calls navigateToPlayers on Players click', () => {
    screen.getByText('Players').click();

    expect(mockRouterService.navigateToPlayers).toHaveBeenCalledOnce();
  });

  it('renders Transfers link', () => {
    expect(screen.getByText('Transfers')).toBeInTheDocument();
  });

  it('calls navigateToTransferWindow with current transfer window id on Transfers click', () => {
    screen.getByText('Transfers').click();

    expect(mockRouterService.navigateToTransferWindow).toHaveBeenCalledExactlyOnceWith(
      current.transferWindow!.id,
    );
  });

  it('renders More link', () => {
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  it('calls navigateToMore on More click', () => {
    screen.getByText('More').click();

    expect(mockRouterService.navigateToMore).toHaveBeenCalledOnce();
  });
});
