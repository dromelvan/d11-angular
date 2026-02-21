import { Component } from '@angular/core';
import type { TeamBase } from '@app/core/api';
import { fakeTeamBase } from '@app/core/api/test/faker-util';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { TeamBaseComponent } from './team-base.component';

let team: TeamBase;

@Component({
  template: ` <app-team [team]="team" /> `,
  standalone: true,
  imports: [TeamBaseComponent],
})
class HostComponent {
  team = team;
}

describe('TeamBaseComponent', () => {
  beforeEach(async () => {
    team = fakeTeamBase();
    await render(HostComponent, {});
  });

  it('renders', async () => {
    const teamElement = document.querySelector('.team-base');

    expect(teamElement).toBeInTheDocument();
  });

  it('renders team name', async () => {
    expect(screen.getByText(team.name)).toBeInTheDocument();
  });

  it('renders team image', async () => {
    const img = screen.getByAltText(team.name);

    expect(img).toBeInTheDocument();
  });
});
