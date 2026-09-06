import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CountryApiService,
  Player,
  PlayerApiService,
  PlayerSeasonStat,
  PlayerSeasonStatApiService,
  PositionApiService,
  TeamApiService,
  UpdatePlayerSeasonStatInput,
} from '@app/core/api';
import { Country } from '@app/core/api/model/country.model';
import { PlayerInput } from '@app/core/api/model/player-input.model';
import { Position } from '@app/core/api/model/position.model';
import { TeamBase } from '@app/core/api/model/team-base.model';
import { CurrentService } from '@app/core/current/current.service';
import { RouterService } from '@app/core/router/router.service';
import {
  ButtonSubmitComponent,
  InputAutocompleteComponent,
  InputDateComponent,
  InputNumberComponent,
  InputTextComponent,
} from '@app/shared/form';
import { SectionComponent } from '@app/shared/section/section.component';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-edit-player-form',
  imports: [
    ReactiveFormsModule,
    ButtonSubmitComponent,
    InputAutocompleteComponent,
    InputDateComponent,
    InputNumberComponent,
    InputTextComponent,
    SectionComponent,
  ],
  templateUrl: './edit-player-form.component.html',
})
export class EditPlayerFormComponent {
  playerId = input.required<number>();

  protected form = inject(FormBuilder).group({
    firstName: new FormControl(''),
    lastName: new FormControl('', Validators.required),
    fullName: new FormControl<string | null>(null),
    position: new FormControl<Position | null>(null, Validators.required),
    team: new FormControl<TeamBase | null>(null, Validators.required),
    statSourceId: new FormControl<number | null>(null),
    premierLeagueId: new FormControl<number | null>(null),
    dateOfBirth: new FormControl(''),
    height: new FormControl<number | null>(null),
    country: new FormControl<Country | null>(null),
  });

  protected rxCountries = rxResource({
    stream: () => this.countryApiService.getCountries(),
  });

  protected rxPositions = rxResource({
    stream: () => this.positionApiService.getPositions(),
  });

  protected rxTeams = rxResource({
    stream: () => this.teamApiService.getTeams(),
  });

  protected countries = signal<Country[]>([]);
  protected positions = signal<Position[]>([]);
  protected teams = signal<TeamBase[]>([]);

  protected readonly isLoading = computed(
    () =>
      this.rxCountries.isLoading() ||
      this.rxPositions.isLoading() ||
      this.rxTeams.isLoading() ||
      this.rxPlayer.isLoading() ||
      this.rxPlayerSeasonStats.isLoading() ||
      this.rxUpdatePlayer.isLoading() ||
      this.rxUpdatePlayerSeasonStat.isLoading(),
  );

  private rxPlayer = rxResource<Player, number>({
    params: () => this.playerId(),
    stream: ({ params }) => this.playerApiService.getById(params),
  });

  private rxPlayerSeasonStats = rxResource<PlayerSeasonStat[], number>({
    params: () => this.playerId(),
    stream: ({ params }) => this.playerApiService.getPlayerSeasonStatsByPlayerId(params),
  });

  private playerSeasonStat = computed<PlayerSeasonStat | undefined>(() =>
    this.rxPlayerSeasonStats
      .value()
      ?.find((playerSeasonStat) => playerSeasonStat.season.id === this.currentService.season()?.id),
  );

  private rxUpdatePlayer = rxResource<Player, PlayerInput | undefined>({
    params: () => this.playerInput(),
    stream: ({ params }) =>
      params != null ? this.playerApiService.updatePlayer(this.playerId(), params) : EMPTY,
  });

  private rxUpdatePlayerSeasonStat = rxResource<
    PlayerSeasonStat,
    { playerSeasonStatId: number; input: UpdatePlayerSeasonStatInput } | undefined
  >({
    params: () => {
      const player = this.rxUpdatePlayer.value();
      const playerSeasonStat = this.playerSeasonStat();
      if (player == null || playerSeasonStat == null) return undefined;
      const rawValue = this.form.getRawValue();
      return {
        playerSeasonStatId: playerSeasonStat.id,
        input: {
          positionId: rawValue.position?.id ?? 0,
          teamId: rawValue.team?.id ?? 0,
          d11TeamId: playerSeasonStat.d11Team.id,
        },
      };
    },
    stream: ({ params }) =>
      params != null
        ? this.playerSeasonStatApiService.updatePlayerSeasonStat(
            params.playerSeasonStatId,
            params.input,
          )
        : EMPTY,
  });

  private playerInput = signal<PlayerInput | undefined>(undefined);
  private formPatched = false;

  private countryApiService = inject(CountryApiService);
  private currentService = inject(CurrentService);
  private playerApiService = inject(PlayerApiService);
  private playerSeasonStatApiService = inject(PlayerSeasonStatApiService);
  private positionApiService = inject(PositionApiService);
  private routerService = inject(RouterService);
  private teamApiService = inject(TeamApiService);

  constructor() {
    effect(() => {
      const player = this.rxPlayer.value();
      const playerSeasonStat = this.playerSeasonStat();
      if (this.formPatched || !player || !playerSeasonStat) return;
      this.formPatched = true;
      this.form.patchValue({
        firstName: player.firstName,
        lastName: player.lastName,
        fullName: player.fullName ?? null,
        statSourceId: player.statSourceId,
        premierLeagueId: player.premierLeagueId,
        dateOfBirth: player.dateOfBirth ?? '',
        height: player.height ?? null,
        country: player.country,
        position: playerSeasonStat.position,
        team: playerSeasonStat.team,
      });
    });

    effect(() => {
      const playerSeasonStat = this.rxUpdatePlayerSeasonStat.value();
      if (playerSeasonStat != null) {
        this.routerService.navigateToPlayer(this.playerId());
      }
    });
  }

  protected onCountrySearch(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.countries.set(
      (this.rxCountries.value() ?? []).filter((country) =>
        country.name.toLowerCase().includes(query),
      ),
    );
  }

  protected onPositionSearch(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.positions.set(
      (this.rxPositions.value() ?? []).filter((position) =>
        position.name.toLowerCase().includes(query),
      ),
    );
  }

  protected onTeamSearch(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.teams.set(
      (this.rxTeams.value() ?? []).filter((team) => team.name.toLowerCase().includes(query)),
    );
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const rawValue = this.form.getRawValue();
    this.playerInput.set({
      firstName: rawValue.firstName ?? '',
      lastName: rawValue.lastName ?? '',
      fullName: rawValue.fullName ?? undefined,
      statSourceId: rawValue.statSourceId ?? 0,
      premierLeagueId: rawValue.premierLeagueId ?? 0,
      dateOfBirth: rawValue.dateOfBirth ?? undefined,
      height: rawValue.height ?? 0,
      countryId: rawValue.country?.id ?? 1,
    });
  }
}
