import { Component } from '@angular/core';
import type { D11TeamBase } from '@app/core/api';
import { fakeD11TeamBase } from '@app/core/api/test/faker-util';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { D11TeamBaseComponent } from './d11-team-base.component';

let d11Team: D11TeamBase;

@Component({
  template: ` <app-d11-team [d11Team]="d11Team" /> `,
  standalone: true,
  imports: [D11TeamBaseComponent],
})
class HostComponent {
  d11Team = d11Team;
}

describe('D11TeamBaseComponent', () => {
  beforeEach(async () => {
    d11Team = fakeD11TeamBase();
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
