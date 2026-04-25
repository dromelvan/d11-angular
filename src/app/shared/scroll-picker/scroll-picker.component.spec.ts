import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ScrollPickerComponent } from './scroll-picker.component';
import { ScrollPickerItem } from './scroll-picker-item.model';

const items: ScrollPickerItem[] = [
  { id: 1, label: '1', sublabel: '15 AUG' },
  { id: 2, label: '2', sublabel: '22 AUG' },
  { id: 3, label: '3', sublabel: '29 AUG' },
];

describe('ScrollPickerComponent', () => {
  let fixture: ComponentFixture<ScrollPickerComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ScrollPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollPickerComponent);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('selectedId', 2);
    fixture.detectChanges();
  });

  it('renders all items', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
  });

  it('renders label and sublabel for each item', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].textContent).toContain('1');
    expect(buttons[0].textContent).toContain('15 AUG');
  });

  it('applies selected highlight to the selected item', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons[1].classList).toContain('bg-surface-300');
    expect(buttons[0].classList).not.toContain('bg-surface-300');
  });

  it('emits selected id when item is clicked', () => {
    let emitted: number | undefined;
    fixture.componentInstance.selected.subscribe((id) => (emitted = id));

    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[0].click();

    expect(emitted).toBe(1);
  });
});
