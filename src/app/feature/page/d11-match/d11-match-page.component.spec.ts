import { ComponentFixture, TestBed } from '@angular/core/testing';
import { D11Match, PlayerMatchStat, Status } from '@app/core/api';
import { D11MatchApiService } from '@app/core/api/d11-match/d11-match-api.service';
import { fakeD11Match, fakeD11TeamBase, fakePlayerMatchStat } from '@app/test';
import { LoadingService } from '@app/core/loading/loading.service';
import { RouterService } from '@app/core/router/router.service';
import { DynamicDialogService } from '@app/shared/dialog/dynamic-dialog-service/dynamic-dialog.service';
import { waitFor } from '@testing-library/angular';
import { of } from 'rxjs';
import { beforeEach, describe, expect, vi } from 'vitest';
import { D11MatchPageComponent } from './d11-match-page.component';

const mockDynamicDialogService = { openPlayerMatchStat: vi.fn() };
const mockRouterService = { navigateToPlayer: vi.fn() };

describe('D11MatchPageComponent', () => {
  let fixture: ComponentFixture<D11MatchPageComponent>;

  async function setup(d11Match: D11Match, playerMatchStats: PlayerMatchStat[]) {
    const d11MatchApi = {
      getById: vi.fn().mockReturnValue(of(d11Match)),
      getPlayerMatchStatsByD11MatchId: vi.fn().mockReturnValue(of(playerMatchStats)),
    } as unknown as D11MatchApiService;

    await TestBed.configureTestingModule({
      imports: [D11MatchPageComponent],
      providers: [
        { provide: D11MatchApiService, useValue: d11MatchApi },
        { provide: LoadingService, useValue: { register: vi.fn() } },
        { provide: DynamicDialogService, useValue: mockDynamicDialogService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(D11MatchPageComponent);
    fixture.componentRef.setInput('d11MatchId', 1);
    fixture.detectChanges();
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Pending ---------------------------------------------------------------------------------------

  describe('pending', () => {
    beforeEach(async () => {
      const homeD11Team = fakeD11TeamBase();
      const awayD11Team = fakeD11TeamBase();
      await setup({ ...fakeD11Match(), homeD11Team, awayD11Team, status: Status.PENDING }, []);
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(fixture.nativeElement.querySelector('.app-d11-match-page')).toBeInTheDocument();
      });
    });

    it('renders match header', async () => {
      await waitFor(() => {
        expect(
          fixture.nativeElement.querySelector('.app-d11-match-header-card'),
        ).toBeInTheDocument();
      });
    });

    it('does not render player stats', async () => {
      await waitFor(() => {
        expect(fixture.nativeElement.textContent).not.toContain('Player stats');
      });
    });
  });

  // Not pending -----------------------------------------------------------------------------------

  describe('not pending', () => {
    beforeEach(async () => {
      const homeD11Team = fakeD11TeamBase();
      const awayD11Team = fakeD11TeamBase();
      const playerMatchStat = { ...fakePlayerMatchStat(), d11Team: homeD11Team };
      await setup({ ...fakeD11Match(), homeD11Team, awayD11Team, status: Status.FINISHED }, [
        playerMatchStat,
      ]);
    });

    it('renders', async () => {
      await waitFor(() => {
        expect(fixture.nativeElement.querySelector('.app-d11-match-page')).toBeInTheDocument();
      });
    });

    it('renders match header', async () => {
      await waitFor(() => {
        expect(
          fixture.nativeElement.querySelector('.app-d11-match-header-card'),
        ).toBeInTheDocument();
      });
    });

    it('renders player stats', async () => {
      await waitFor(() => {
        expect(fixture.nativeElement.textContent).toContain('Player stats');
      });
    });
  });
});
