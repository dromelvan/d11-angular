import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchWeek, Status } from '@app/core/api';
import { fakeMatchWeek } from '@app/test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchWeekPickerDrawerComponent } from './match-week-picker-drawer.component';

describe('MatchWeekPickerDrawerComponent', () => {
  let component: MatchWeekPickerDrawerComponent;
  let fixture: ComponentFixture<MatchWeekPickerDrawerComponent>;
  let matchWeeks: MatchWeek[];

  beforeEach(async () => {
    vi.clearAllMocks();

    matchWeeks = [
      { ...fakeMatchWeek(), id: 1, matchWeekNumber: 1, status: Status.FINISHED },
      { ...fakeMatchWeek(), id: 2, matchWeekNumber: 2, status: Status.FINISHED },
    ];

    await TestBed.configureTestingModule({
      imports: [MatchWeekPickerDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchWeekPickerDrawerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('matchWeeks', matchWeeks);
    fixture.componentRef.setInput('selectedId', matchWeeks[0].id);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with drawer closed', () => {
    expect(component['visible']()).toBe(false);
  });

  it('should open on open()', () => {
    component.open();
    expect(component['visible']()).toBe(true);
  });

  it('should close on close()', () => {
    component.open();
    component['close']();
    expect(component['visible']()).toBe(false);
  });

  it('should emit matchWeekSelected and close on match week change', () => {
    component.open();
    const emitted: number[] = [];
    component.matchWeekSelected.subscribe((id) => emitted.push(id));

    component['onMatchWeekChange'](matchWeeks[1].id);

    expect(emitted).toEqual([matchWeeks[1].id]);
    expect(component['visible']()).toBe(false);
  });

  it('should apply bg-primary to currentId button', async () => {
    component.open();
    fixture.componentRef.setInput('currentId', matchWeeks[1].id);
    fixture.detectChanges();
    await fixture.whenStable();

    const buttons = document.body.querySelectorAll('button');
    expect(buttons[1].classList).toContain('bg-primary');
    expect(buttons[0].classList).not.toContain('bg-primary');
  });

  it('should show in progress indicator for ACTIVE and FULL_TIME status', async () => {
    component.open();
    fixture.componentRef.setInput('matchWeeks', [
      { ...fakeMatchWeek(), id: 1, matchWeekNumber: 1, status: Status.PENDING },
      { ...fakeMatchWeek(), id: 2, matchWeekNumber: 2, status: Status.ACTIVE },
      { ...fakeMatchWeek(), id: 3, matchWeekNumber: 3, status: Status.FULL_TIME },
      { ...fakeMatchWeek(), id: 4, matchWeekNumber: 4, status: Status.FINISHED },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const indicators = document.body.querySelectorAll('.text-error');
    expect(indicators.length).toBe(2);
  });
});
