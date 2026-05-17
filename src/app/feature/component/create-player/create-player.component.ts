import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryApiService, Player, PlayerApiService } from '@app/core/api';
import { Country } from '@app/core/api/model/country.model';
import { PlayerInput } from '@app/core/api/model/player-input.model';
import { RouterService } from '@app/core/router/router.service';
import { AvatarComponent } from '@app/shared/avatar/avatar.component';
import {
  ButtonSubmitComponent,
  InputAutocompleteComponent,
  InputDateComponent,
  InputNumberComponent,
  InputTextComponent,
} from '@app/shared/form';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-create-player',
  imports: [
    ReactiveFormsModule,
    AvatarComponent,
    InputTextComponent,
    InputNumberComponent,
    InputDateComponent,
    InputAutocompleteComponent,
    ButtonSubmitComponent,
  ],
  templateUrl: './create-player.component.html',
})
export class CreatePlayerComponent {
  protected form = inject(FormBuilder).group({
    firstName: new FormControl(''),
    lastName: new FormControl('', Validators.required),
    fullName: new FormControl(''),
    statSourceId: new FormControl<number | null>(null),
    premierLeagueId: new FormControl<number | null>(null),
    dateOfBirth: new FormControl(''),
    height: new FormControl<number | null>(null),
    country: new FormControl<Country | null>(null),
  });

  protected rxCountries = rxResource({
    stream: () => this.countryApiService.getCountries(),
  });

  protected countries = signal<Country[]>([]);

  private rxCreatePlayer = rxResource<Player, PlayerInput | undefined>({
    params: () => this.playerInput(),
    stream: ({ params }) => (params != null ? this.playerApiService.createPlayer(params) : EMPTY),
  });

  private playerInput = signal<PlayerInput | undefined>(undefined);

  private countryApiService = inject(CountryApiService);
  private playerApiService = inject(PlayerApiService);
  private routerService = inject(RouterService);

  constructor() {
    effect(() => {
      const player = this.rxCreatePlayer.value();
      if (player != null) {
        this.routerService.navigateToPlayer(player.id);
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

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.playerInput.set(this.form.getRawValue() as PlayerInput);
  }
}
