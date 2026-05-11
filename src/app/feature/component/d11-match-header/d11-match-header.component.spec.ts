import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { fakeD11MatchBase } from '@app/test';
import { D11MatchBase, Status } from '@app/core/api';
import { ImgWidth } from '@app/shared/img/img-width';
import { beforeEach, describe, expect } from 'vitest';
import { D11MatchHeaderComponent } from './d11-match-header.component';

describe('D11MatchHeaderComponent', () => {
  let fixture: ComponentFixture<D11MatchHeaderComponent>;

  async function setup(match?: D11MatchBase, links = true, emphasised = true) {
    fixture = TestBed.createComponent(D11MatchHeaderComponent);
    if (match !== undefined) {
      fixture.componentRef.setInput('match', match);
    }
    fixture.componentRef.setInput('links', links);
    fixture.componentRef.setInput('emphasised', emphasised);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D11MatchHeaderComponent],
    }).compileComponents();
  });

  // No match --------------------------------------------------------------------------------------

  describe('no match', () => {
    beforeEach(async () => {
      await setup();
    });

    it('does not render', () => {
      expect(fixture.nativeElement.querySelector('*')).toBeNull();
    });
  });

  // With match ------------------------------------------------------------------------------------

  describe('with match', () => {
    let match: D11MatchBase;

    beforeEach(async () => {
      match = { ...fakeD11MatchBase(), status: Status.FINISHED };
      await setup(match);
    });

    it('renders home team short name', () => {
      expect(fixture.nativeElement.textContent).toContain(match.homeD11Team.shortName);
    });

    it('renders home team full name', () => {
      expect(fixture.nativeElement.textContent).toContain(match.homeD11Team.name);
    });

    it('renders away team short name', () => {
      expect(fixture.nativeElement.textContent).toContain(match.awayD11Team.shortName);
    });

    it('renders away team full name', () => {
      expect(fixture.nativeElement.textContent).toContain(match.awayD11Team.name);
    });

    it('renders score', () => {
      expect(fixture.nativeElement.textContent).toContain(
        `${match.homeTeamGoalsScored}\u2013${match.awayTeamGoalsScored}`,
      );
    });

    it('renders points', () => {
      expect(fixture.nativeElement.textContent).toContain(
        `(${match.homeTeamPoints}\u2013${match.awayTeamPoints})`,
      );
    });

    it('renders elapsed time', () => {
      expect(fixture.nativeElement.textContent).toContain(match.elapsed);
    });

    it('renders datetime', () => {
      const formatted = new DatePipe('en-US').transform(match.datetime, 'MMM dd, yyyy, H:mm');
      expect(fixture.nativeElement.textContent).toContain(formatted);
    });
  });

  // Pending match ---------------------------------------------------------------------------------

  describe('pending match', () => {
    let match: D11MatchBase;

    beforeEach(async () => {
      match = { ...fakeD11MatchBase(), status: Status.PENDING };
      await setup(match);
    });

    it('does not render score', () => {
      expect(fixture.nativeElement.textContent).not.toContain(
        `${match.homeTeamGoalsScored}\u2013${match.awayTeamGoalsScored}`,
      );
    });

    it('renders vs', () => {
      expect(fixture.nativeElement.textContent).toContain('vs');
    });
  });

  // Postponed match -------------------------------------------------------------------------------

  describe('postponed match', () => {
    let match: D11MatchBase;

    beforeEach(async () => {
      match = { ...fakeD11MatchBase(), status: Status.POSTPONED };
      await setup(match, false);
    });

    it('does not render score', () => {
      expect(fixture.nativeElement.textContent).not.toContain(
        `${match.homeTeamGoalsScored}\u2013${match.awayTeamGoalsScored}`,
      );
    });

    it('renders vs', () => {
      expect(fixture.nativeElement.textContent).toContain('vs');
    });

    it('renders postponed', () => {
      expect(fixture.nativeElement.querySelector('[data-testid="datetime"]').textContent).toContain(
        'Postponed',
      );
    });

    it('does not render datetime', () => {
      const formatted = new DatePipe('en-US').transform(match.datetime, 'MMM dd, yyyy, H:mm');
      expect(fixture.nativeElement.textContent).not.toContain(formatted);
    });
  });

  // Links -----------------------------------------------------------------------------------------

  describe('with links', () => {
    let match: D11MatchBase;

    beforeEach(async () => {
      match = { ...fakeD11MatchBase(), status: Status.FINISHED };
      await setup(match, true);
    });

    it('renders match week link', () => {
      expect(fixture.nativeElement.textContent).toContain(
        `Match week ${match.matchWeek.matchWeekNumber}`,
      );
    });
  });

  describe('without links', () => {
    let match: D11MatchBase;

    beforeEach(async () => {
      match = { ...fakeD11MatchBase(), status: Status.FINISHED };
      await setup(match, false);
    });

    it('does not render match week link', () => {
      expect(fixture.nativeElement.textContent).not.toContain(
        `Match week ${match.matchWeek.matchWeekNumber}`,
      );
    });
  });

  // Emphasis --------------------------------------------------------------------------------------

  describe('emphasised', () => {
    beforeEach(async () => {
      await setup({ ...fakeD11MatchBase(), status: Status.FINISHED }, false, true);
    });

    it('renders score with large text', () => {
      expect(fixture.nativeElement.querySelector('.text-4xl')).toBeTruthy();
    });

    it('renders team images with large width', () => {
      const images = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLImageElement>(
        'app-d11-team-img img',
      );
      images.forEach((img: HTMLImageElement) =>
        expect(img).toHaveAttribute('width', ImgWidth.LARGE),
      );
    });
  });

  describe('de-emphasised', () => {
    beforeEach(async () => {
      await setup({ ...fakeD11MatchBase(), status: Status.FINISHED }, false, false);
    });

    it('renders score with smaller text', () => {
      expect(fixture.nativeElement.querySelector('.text-2xl')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.text-4xl')).toBeNull();
    });

    it('renders team images with small width', () => {
      const images = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLImageElement>(
        'app-d11-team-img img',
      );
      images.forEach((img: HTMLImageElement) =>
        expect(img).toHaveAttribute('width', ImgWidth.SMALL),
      );
    });
  });
});
