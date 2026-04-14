import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { RulesPageComponent } from './rules-page.component';

@Component({
  template: ` <app-rules-page />`,
  standalone: true,
  imports: [RulesPageComponent],
})
class HostComponent {}

describe('RulesPageComponent', () => {
  beforeEach(async () => {
    await render(HostComponent);
  });

  it('renders', () => {
    expect(document.querySelector('app-rules-page')).toBeInTheDocument();
  });

  it('renders the page header', () => {
    expect(screen.getByText('Rules')).toBeInTheDocument();
  });

  it('renders section headers', () => {
    for (const header of [
      'Scoring',
      'Player points',
      'Participation fee',
      'The draft',
      'The transfer system',
    ]) {
      expect(screen.getByText(header)).toBeInTheDocument();
    }
  });
});
