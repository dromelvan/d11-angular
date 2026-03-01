import { Component } from '@angular/core';
import type { D11TeamBase } from '@app/core/api';
import { fakeD11TeamBase } from '@app/core/api/test/faker-util';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { D11TeamBaseComponent } from './d11-team-base.component';

let d11Team: D11TeamBase;
let justify: 'start' | 'center' | 'end' | undefined;

@Component({
  template: ` <app-d11-team-base [d11Team]="d11Team" [justify]="justify" /> `,
  standalone: true,
  imports: [D11TeamBaseComponent],
})
class HostComponent {
  d11Team = d11Team;
  justify = justify;
}

describe('D11TeamBaseComponent', () => {
  beforeEach(async () => {
    d11Team = fakeD11TeamBase();
    justify = undefined;
    await render(HostComponent, {});
  });

  it('renders', async () => {
    const d11TeamElement = document.querySelector('.d11-team-base');

    expect(d11TeamElement).toBeInTheDocument();
  });

  it('renders d11 team name', async () => {
    expect(screen.getByText(d11Team.name)).toBeInTheDocument();
  });

  it('renders d11 team image', async () => {
    const img = screen.getByAltText(d11Team.name);

    expect(img).toBeInTheDocument();
  });
});

describe('D11TeamBaseComponent justify', () => {
  it.each(['start', 'center', 'end'] as const)('applies justify-%s class', async (value) => {
    d11Team = fakeD11TeamBase();
    justify = value;
    await render(HostComponent, {});

    expect(document.querySelector('.d11-team-base')).toHaveClass(`justify-${value}`);
  });

  it('does not apply justify class when undefined', async () => {
    d11Team = fakeD11TeamBase();
    justify = undefined;
    await render(HostComponent, {});

    const d11TeamElement = document.querySelector('.d11-team-base');
    expect(d11TeamElement).not.toHaveClass('justify-start');
    expect(d11TeamElement).not.toHaveClass('justify-center');
    expect(d11TeamElement).not.toHaveClass('justify-end');
  });
});
