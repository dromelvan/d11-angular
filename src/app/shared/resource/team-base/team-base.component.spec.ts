import { Component } from '@angular/core';
import type { TeamBase } from '@app/core/api';
import { fakeTeamBase } from '@app/test';
import { ImgWidth } from '@app/shared/img/img-width';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { TeamBaseComponent } from './team-base.component';

let team: TeamBase;
let justify: 'start' | 'center' | 'end' | undefined;
let imgWidth: string | undefined;

@Component({
  template: ` <app-team-base [team]="team" [justify]="justify" [imgWidth]="imgWidth" /> `,
  standalone: true,
  imports: [TeamBaseComponent],
})
class HostComponent {
  team = team;
  justify = justify;
  imgWidth = imgWidth;
}

describe('TeamBaseComponent', () => {
  beforeEach(async () => {
    team = fakeTeamBase();
    justify = undefined;
    imgWidth = undefined;
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

describe('TeamBaseComponent justify', () => {
  it.each(['start', 'center', 'end'] as const)('applies justify-%s class', async (value) => {
    team = fakeTeamBase();
    justify = value;
    await render(HostComponent, {});

    expect(document.querySelector('.team-base')).toHaveClass(`justify-${value}`);
  });

  it('does not apply justify class when undefined', async () => {
    team = fakeTeamBase();
    justify = undefined;
    await render(HostComponent, {});

    const teamElement = document.querySelector('.team-base');
    expect(teamElement).not.toHaveClass('justify-start');
    expect(teamElement).not.toHaveClass('justify-center');
    expect(teamElement).not.toHaveClass('justify-end');
  });
});

describe('TeamBaseComponent team image', () => {
  it('has propagated imgWidth', async () => {
    team = fakeTeamBase();
    imgWidth = ImgWidth.XLARGE;
    await render(HostComponent, {});

    const img = screen.getByAltText(team.name) as HTMLImageElement;

    expect(img).toHaveAttribute('width', ImgWidth.XLARGE);
  });

  it('has default width when no imgWidth provided', async () => {
    team = fakeTeamBase();
    imgWidth = undefined;
    await render(HostComponent, {});

    const img = screen.getByAltText(team.name) as HTMLImageElement;

    expect(img).toHaveAttribute('width', '32');
  });
});
