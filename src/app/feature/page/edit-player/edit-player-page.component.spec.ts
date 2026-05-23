import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import {
  CountryApiService,
  PlayerApiService,
  PlayerSeasonStatApiService,
  PositionApiService,
  TeamApiService,
} from '@app/core/api';
import { CurrentService } from '@app/core/current/current.service';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { EditPlayerComponent } from '@app/feature/component/edit-player/edit-player.component';
import { fakePlayer } from '@app/test';
import { render } from '@testing-library/angular';
import { beforeEach, describe, expect } from 'vitest';
import { EditPlayerPageComponent } from './edit-player-page.component';

describe('EditPlayerPageComponent', () => {
  let fixture: ComponentFixture<EditPlayerPageComponent>;

  beforeEach(async () => {
    ({ fixture } = await render(EditPlayerPageComponent, {
      inputs: { playerId: 1 },
      providers: [
        {
          provide: PlayerApiService,
          useValue: {
            getById: vi.fn().mockReturnValue(of(fakePlayer())),
            getPlayerSeasonStatsByPlayerId: vi.fn().mockReturnValue(of([])),
            updatePlayer: vi.fn(),
          },
        },
        { provide: PlayerSeasonStatApiService, useValue: { updatePlayerSeasonStat: vi.fn() } },
        { provide: CountryApiService, useValue: { getCountries: vi.fn().mockReturnValue(of([])) } },
        {
          provide: PositionApiService,
          useValue: { getPositions: vi.fn().mockReturnValue(of([])) },
        },
        { provide: TeamApiService, useValue: { getTeams: vi.fn().mockReturnValue(of([])) } },
        { provide: CurrentService, useValue: { season: signal(undefined) } },
        { provide: RouterService, useValue: { navigateToPlayer: vi.fn() } },
        { provide: LoadingService, useValue: { register: vi.fn() } },
      ],
    }));
  });

  it('renders the edit player component', () => {
    expect(fixture.nativeElement.querySelector('app-edit-player')).toBeInTheDocument();
  });

  it('passes playerId to EditPlayerComponent', () => {
    const editPlayer = fixture.debugElement.query(By.directive(EditPlayerComponent));
    expect(editPlayer.componentInstance.playerId()).toBe(1);
  });
});
