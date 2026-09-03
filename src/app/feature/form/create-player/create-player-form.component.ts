import { Component, computed, effect, inject, signal } from '@angular/core';
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
} from '@app/core/api';
import { Country } from '@app/core/api/model/country.model';
import { CreatePlayerSeasonStatInput } from '@app/core/api/model/create-player-season-stat-input.model';
import { PlayerInput } from '@app/core/api/model/player-input.model';
import { Position } from '@app/core/api/model/position.model';
import { TeamBase } from '@app/core/api/model/team-base.model';
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
  selector: 'app-create-player-form',
  imports: [
    ReactiveFormsModule,
    ButtonSubmitComponent,
    InputAutocompleteComponent,
    InputDateComponent,
    InputNumberComponent,
    InputTextComponent,
    SectionComponent,
  ],
  templateUrl: './create-player-form.component.html',
})
export class CreatePlayerFormComponent {
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
    () => this.rxCreatePlayer.isLoading() || this.rxCreatePlayerSeasonStat.isLoading(),
  );

  private rxCreatePlayer = rxResource<Player, PlayerInput | undefined>({
    params: () => this.playerInput(),
    stream: ({ params }) => (params != null ? this.playerApiService.createPlayer(params) : EMPTY),
  });

  private rxCreatePlayerSeasonStat = rxResource<
    PlayerSeasonStat,
    CreatePlayerSeasonStatInput | undefined
  >({
    params: () => {
      const player = this.rxCreatePlayer.value();
      if (player == null) return undefined;
      const rawValue = this.form.getRawValue();
      return {
        playerId: player.id,
        positionId: rawValue.position?.id ?? 0,
        teamId: rawValue.team?.id ?? 0,
      };
    },
    stream: ({ params }) =>
      params != null ? this.playerSeasonStatApiService.createPlayerSeasonStat(params) : EMPTY,
  });

  private playerInput = signal<PlayerInput | undefined>(undefined);

  private countryApiService = inject(CountryApiService);
  private playerApiService = inject(PlayerApiService);
  private playerSeasonStatApiService = inject(PlayerSeasonStatApiService);
  private positionApiService = inject(PositionApiService);
  private routerService = inject(RouterService);
  private teamApiService = inject(TeamApiService);

  constructor() {
    effect(() => {
      const playerSeasonStat = this.rxCreatePlayerSeasonStat.value();
      if (playerSeasonStat != null) {
        this.routerService.navigateToPlayer(playerSeasonStat.player.id);
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
