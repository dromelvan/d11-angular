import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeD11Match, fakeD11TeamBase } from '@app/test';
import { D11Match } from '@app/core/api';
import { beforeEach, describe, expect } from 'vitest';
import { D11MatchHeaderCardComponent } from './d11-match-header-card.component';

describe('D11MatchHeaderCardComponent', () => {
  let fixture: ComponentFixture<D11MatchHeaderCardComponent>;

  async function setup(match?: D11Match) {
    fixture = TestBed.createComponent(D11MatchHeaderCardComponent);
    if (match !== undefined) {
      fixture.componentRef.setInput('match', match);
    }
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D11MatchHeaderCardComponent],
    }).compileComponents();
  });

  // No match --------------------------------------------------------------------------------------

  describe('without match', () => {
    beforeEach(async () => {
      await setup();
    });

    it('does not render', () => {
      expect(fixture.nativeElement.querySelector('*')).toBeNull();
    });
  });

  // With match ------------------------------------------------------------------------------------

  describe('with match', () => {
    let match: D11Match;

    beforeEach(async () => {
      match = {
        ...fakeD11Match(),
        homeD11Team: { ...fakeD11TeamBase(), name: 'Team1' },
        awayD11Team: { ...fakeD11TeamBase(), name: 'Team2' },
      };
      await setup(match);
    });

    it('renders home team name', () => {
      expect(fixture.nativeElement.textContent).toContain(match.homeD11Team.name);
    });

    it('renders away team name', () => {
      expect(fixture.nativeElement.textContent).toContain(match.awayD11Team.name);
    });
  });
});
