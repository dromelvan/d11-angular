import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { fakePlayerBase } from '@app/core/api/test/faker-util';
import { MatchEvent } from '@app/shared/model';
import { expect } from 'vitest';
import { MatchEventsComponent } from './match-events.component';

let matchEvents: MatchEvent[];

@Component({
  template: `<app-match-events [matchEvents]="matchEvents" />`,
  standalone: true,
  imports: [MatchEventsComponent],
})
class HostComponent {
  matchEvents = matchEvents;
}

const fakeEvent = (overrides: Partial<MatchEvent> = {}): MatchEvent => ({
  team: 'home',
  player: fakePlayerBase(),
  type: 'goal',
  time: 45,
  ...overrides,
});

describe('MatchEventsComponent', () => {
  describe('empty list', () => {
    beforeEach(async () => {
      matchEvents = [];
      await render(HostComponent, {});
    });

    it('renders no event rows', () => {
      expect(screen.queryAllByTestId('match-event')).toHaveLength(0);
    });

    it('renders no container', () => {
      expect(document.querySelector('.app-match-events')).not.toBeInTheDocument();
    });
  });

  describe('non-empty list', () => {
    beforeEach(async () => {
      matchEvents = [fakeEvent({ time: 10 }), fakeEvent({ time: 45 }), fakeEvent({ time: 80 })];
      await render(HostComponent, {});
    });

    it('renders a row for each event', () => {
      expect(screen.getAllByTestId('match-event')).toHaveLength(3);
    });

    it('renders the container', () => {
      expect(document.querySelector('.app-match-events')).toBeInTheDocument();
    });
  });
});
