import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Player, PlayerApiService, PlayerSeasonStat } from '@app/core/api';
import { PRIMARY } from '@app/app.theme';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { RouterService } from '@app/core/router/router.service';
import { fakePlayer, fakePlayerSeasonStat } from '@app/test';
import { PlayerPageComponent } from './player-page.component';

describe('PlayerPageComponent', () => {
  const mockPageContextService = {
    register: vi.fn(),
    backgroundColor: signal<string | undefined>(undefined),
  };
  const mockRouterService = {
    navigateToPlayer: vi.fn(),
    navigateToMatch: vi.fn(),
  };

  async function setup(options: {
    player?: Player;
    playerSeasonStats?: PlayerSeasonStat[];
    loading?: boolean;
  }) {
    const { player, playerSeasonStats = [], loading = false } = options;
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [PlayerPageComponent],
      providers: [
        {
          provide: PlayerApiService,
          useValue: {
            getById: vi.fn().mockReturnValue(loading ? NEVER : of(player)),
            getPlayerSeasonStatsByPlayerId: vi
              .fn()
              .mockReturnValue(loading ? NEVER : of(playerSeasonStats)),
            getPlayerMatchStatsByPlayerIdAndSeasonId: vi.fn().mockReturnValue(of([])),
          },
        },
        { provide: PageContextService, useValue: mockPageContextService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();
  }

  async function createFixture(
    playerId: number,
    seasonId?: number,
  ): Promise<ComponentFixture<PlayerPageComponent>> {
    const fixture = TestBed.createComponent(PlayerPageComponent);
    fixture.componentRef.setInput('playerId', playerId);
    if (seasonId !== undefined) {
      fixture.componentRef.setInput('seasonId', seasonId);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  describe('when loading', () => {
    let fixture: ComponentFixture<PlayerPageComponent>;

    beforeEach(async () => {
      await setup({ loading: true });
      fixture = TestBed.createComponent(PlayerPageComponent);
      fixture.componentRef.setInput('playerId', 1);
      fixture.detectChanges();
    });

    it('does not render app-player-hero', () => {
      expect(fixture.nativeElement.querySelector('app-player-hero')).toBeNull();
    });
  });

  describe('when loaded with playerSeasonStat', () => {
    let fixture: ComponentFixture<PlayerPageComponent>;
    let player: Player;
    let playerSeasonStat: PlayerSeasonStat;

    beforeEach(async () => {
      player = fakePlayer();
      playerSeasonStat = fakePlayerSeasonStat();
      await setup({ player, playerSeasonStats: [playerSeasonStat] });
      fixture = await createFixture(1);
    });

    it('registers context with PageContextService', () => {
      expect(mockPageContextService.register).toHaveBeenCalledOnce();
    });

    it('registered title is player name', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.title()).toBe(player.name);
    });

    it('registered subtitle is Season {name}', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBe(`Season ${playerSeasonStat.season.name}`);
    });

    it('registered backgroundColor is team colour', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.backgroundColor()).toBe(playerSeasonStat.team.colour);
    });

    it('renders app-player-hero', () => {
      expect(fixture.nativeElement.querySelector('app-player-hero')).toBeTruthy();
    });

    it('renders app-player-season-stat-section', () => {
      expect(fixture.nativeElement.querySelector('app-player-season-stat-section')).toBeTruthy();
    });

    it('renders app-player-career-stats-section', () => {
      expect(fixture.nativeElement.querySelector('app-player-career-stats-section')).toBeTruthy();
    });

    it('renders app-player-season-match-stats-section', () => {
      expect(
        fixture.nativeElement.querySelector('app-player-season-match-stats-section'),
      ).toBeTruthy();
    });
  });

  describe('when loaded without playerSeasonStat', () => {
    let fixture: ComponentFixture<PlayerPageComponent>;
    let player: Player;

    beforeEach(async () => {
      player = fakePlayer();
      await setup({ player, playerSeasonStats: [] });
      fixture = await createFixture(1);
    });

    it('renders app-player-hero', () => {
      expect(fixture.nativeElement.querySelector('app-player-hero')).toBeTruthy();
    });

    it('does not render app-player-season-stat-section', () => {
      expect(fixture.nativeElement.querySelector('app-player-season-stat-section')).toBeNull();
    });

    it('renders app-player-career-stats-section', () => {
      expect(fixture.nativeElement.querySelector('app-player-career-stats-section')).toBeTruthy();
    });

    it('does not render app-player-season-match-stats-section', () => {
      expect(
        fixture.nativeElement.querySelector('app-player-season-match-stats-section'),
      ).toBeNull();
    });

    it('registered subtitle is undefined', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBeUndefined();
    });

    it('registered backgroundColor is PRIMARY', () => {
      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.backgroundColor()).toBe(PRIMARY);
    });
  });

  describe('with specific seasonId', () => {
    it('uses the playerSeasonStat matching the seasonId', async () => {
      const player = fakePlayer();
      const playerSeasonStat1 = fakePlayerSeasonStat();
      const playerSeasonStat2 = fakePlayerSeasonStat();
      await setup({ player, playerSeasonStats: [playerSeasonStat1, playerSeasonStat2] });
      await createFixture(1, playerSeasonStat2.season.id);

      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBe(`Season ${playerSeasonStat2.season.name}`);
    });

    it('falls back to first playerSeasonStat when no seasonId is provided', async () => {
      const player = fakePlayer();
      const playerSeasonStat1 = fakePlayerSeasonStat();
      const playerSeasonStat2 = fakePlayerSeasonStat();
      await setup({ player, playerSeasonStats: [playerSeasonStat1, playerSeasonStat2] });
      await createFixture(1);

      const context = mockPageContextService.register.mock.calls[0][1];
      expect(context.subtitle()).toBe(`Season ${playerSeasonStat1.season.name}`);
    });
  });
});
