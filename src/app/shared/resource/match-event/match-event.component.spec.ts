import { Component } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { expect } from 'vitest';
import { fakePlayerBase } from '@app/core/api/test/faker-util';
import { MatchEvent, MatchEventType } from '@app/shared/model';
import { MatchEventComponent } from './match-event.component';

let matchEvent: MatchEvent;

@Component({
  template: ` <app-match-event [matchEvent]="matchEvent" />`,
  standalone: true,
  imports: [MatchEventComponent],
})
class HostComponent {
  matchEvent = matchEvent;
}

const fakeEvent = (overrides: Partial<MatchEvent> = {}): MatchEvent => ({
  team: 'home',
  player: fakePlayerBase(),
  type: 'goal',
  time: 45,
  ...overrides,
});
describe('MatchEventComponent', () => {
  describe('home team event', () => {
    beforeEach(async () => {
      matchEvent = fakeEvent({ team: 'home' });
      await render(HostComponent, {});
    });

    it('renders the component', () => {
      expect(screen.getByTestId('match-event')).toBeInTheDocument();
    });

    it('does not apply flex-row-reverse', () => {
      expect(screen.getByTestId('match-event')).not.toHaveClass('flex-row-reverse');
    });

    it('renders the event time', () => {
      expect(screen.getByText(`${matchEvent.time}'`)).toBeInTheDocument();
    });

    it('renders the full player name in the wide-screen span', () => {
      const span = document.querySelector('.hidden.sm\\:inline');
      expect(span).toHaveTextContent(matchEvent.player.name);
    });
  });

  describe('away team event', () => {
    beforeEach(async () => {
      matchEvent = fakeEvent({ team: 'away' });
      await render(HostComponent, {});
    });

    it('applies flex-row-reverse', () => {
      expect(screen.getByTestId('match-event')).toHaveClass('flex-row-reverse');
    });
  });

  describe.each<[MatchEventType, string, string | null]>([
    ['goal', 'goal', null],
    ['ownGoal', 'own_goal', '(OG)'],
    ['penalty', 'goal', '(P)'],
    ['redCard', 'red_card', null],
  ])('MatchEventComponent - %s event', (type, iconPreset, label) => {
    beforeEach(async () => {
      matchEvent = fakeEvent({ type });
      await render(HostComponent, {});
    });

    it(`renders the ${iconPreset} icon`, () => {
      expect(document.querySelector(`app-icon[icon="${iconPreset}"]`)).toBeInTheDocument();
    });

    if (label) {
      it(`renders the ${label} label`, () => {
        expect(screen.getByText(label!)).toBeInTheDocument();
      });
    }
  });

  describe.each<[MatchEventType, number]>([
    ['goal', 0],
    ['penalty', 2],
    ['ownGoal', 3],
  ])('displayName — type "%s" (typeLength %i)', (type, typeLength) => {
    const limit = 14 - typeLength;

    it('uses the full name when it fits within the limit', async () => {
      const player = { ...fakePlayerBase(), name: 'x'.repeat(limit) };
      matchEvent = fakeEvent({ player, type });
      await render(HostComponent, {});

      expect(screen.getAllByText(player.name)).toHaveLength(2);
    });

    it('falls back to short name when full name exceeds the limit', async () => {
      const player = {
        ...fakePlayerBase(),
        name: 'x'.repeat(limit + 1),
        shortName: 'y'.repeat(limit),
      };
      matchEvent = fakeEvent({ player, type });
      await render(HostComponent, {});

      expect(screen.getByText(player.shortName)).toBeInTheDocument();
    });

    it('falls back to last name when both full name and short name exceed the limit', async () => {
      const player = {
        ...fakePlayerBase(),
        name: 'x'.repeat(limit + 1),
        shortName: 'y'.repeat(limit + 1),
        lastName: 'z'.repeat(limit),
      };
      matchEvent = fakeEvent({ player, type });
      await render(HostComponent, {});

      expect(screen.getByText(player.lastName)).toBeInTheDocument();
    });
  });
});
