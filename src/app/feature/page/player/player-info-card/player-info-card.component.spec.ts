import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import type { Player } from '@app/core/api';
import { fakePlayer } from '@app/core/api/test/faker-util';
import { AgePipe } from '@app/shared/pipes';
import { render, screen } from '@testing-library/angular';
import { within } from '@testing-library/dom';
import { expect } from 'vitest';
import { PlayerInfoCardComponent } from './player-info-card.component';

let player: Player;

@Component({
  template: ` <app-player-info-card [player]="player" /> `,
  standalone: true,
  imports: [PlayerInfoCardComponent],
})
class HostComponent {
  player = player;
}

describe('PlayerInfoCardComponent', () => {
  beforeEach(async () => {
    player = fakePlayer();
    await render(HostComponent, {});
  });

  it('renders card', async () => {
    const card = document.querySelector('.app-player-info-card');

    expect(card).toBeInTheDocument();
  });

  it('renders nationality', async () => {
    const nationality = screen.getByTestId('nationality');
    expect(nationality).toBeInTheDocument();

    const label = within(nationality).getByText('Nationality');
    expect(label).toBeInTheDocument();

    const iso = within(nationality).getByText(player.country.iso);
    expect(iso).toBeInTheDocument();
    expect(iso).toHaveClass('sm:hidden');

    const name = within(nationality).getByText(player.country.name);
    expect(name).toBeInTheDocument();
    expect(name).toHaveClass('hidden sm:block');

    const img = within(nationality).getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', player.country.name);
    expect(img).toHaveAttribute('src', expect.stringContaining(player.country.iso));
  });

  it('renders date of birth', async () => {
    const dateOfBirth = screen.getByTestId('date-of-birth');

    const label = within(dateOfBirth).getByText('Date of Birth');
    expect(label).toBeInTheDocument();

    const date = new DatePipe('en-US').transform(new Date(player.dateOfBirth!), 'd.M yyyy');
    const age = new AgePipe().transform(player.dateOfBirth);

    const value = dateOfBirth.querySelector('.app-info-card-value');
    expect(value).toBeInTheDocument();
    expect(value).toHaveTextContent(`${date} age ${age}`);

    const ageSpan = value?.querySelector('span');
    expect(ageSpan).toBeInTheDocument();
    expect(ageSpan).toHaveClass('hidden sm:block');
  });

  it('renders height', async () => {
    const height = screen.getByTestId('height');

    const label = within(height).getByText('Height');
    expect(label).toBeInTheDocument();

    const value = within(height).getByText(/\d+ cm|Unknown/);
    expect(value).toHaveTextContent(`${player.height} cm`);
  });
});

describe('PlayerInfoCardComponent with undefined player', () => {
  it('does not render card', async () => {
    @Component({
      template: ` <app-player-info-card [player]="player" /> `,
      imports: [PlayerInfoCardComponent],
    })
    class UndefinedPlayerHost {
      player = undefined;
    }

    await render(UndefinedPlayerHost, {});
    const card = document.querySelector('.app-player-info-card');
    expect(card).not.toBeInTheDocument();
  });
});

describe('PlayerInfoCardComponent with undefined properties', () => {
  it('renders "Unknown" dateOfBirth and height', async () => {
    player = fakePlayer();
    player.dateOfBirth = undefined;
    player.height = undefined;
    await render(HostComponent, {});

    player.dateOfBirth = undefined;

    const dobLabel = screen.getByText('Date of Birth');
    const dobValue = dobLabel.parentElement?.querySelector('.app-info-card-value');

    expect(dobValue).toHaveTextContent('Unknown');

    const heightLabel = screen.getByText('Height');
    const heightValue = heightLabel.parentElement?.querySelector('.app-info-card-value');

    expect(heightValue).toHaveTextContent('Unknown');
  });
});

describe('PlayerInfoCardComponent with invalid properties', () => {
  it('renders "Unknown" dateOfBirth and height', async () => {
    player = fakePlayer();
    player.dateOfBirth = 'INVALID';
    player.height = 0;
    await render(HostComponent, {});

    player.dateOfBirth = undefined;

    const heightLabel = screen.getByText('Height');
    const heightValue = heightLabel.parentElement?.querySelector('.app-info-card-value');

    expect(heightValue).toHaveTextContent('Unknown');

    const dobLabel = screen.getByText('Date of Birth');
    const dobValue = dobLabel.parentElement?.querySelector('.app-info-card-value');

    expect(dobValue).toHaveTextContent('Unknown');
  });
});
