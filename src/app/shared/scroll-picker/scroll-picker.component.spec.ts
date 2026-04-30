import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SafeDatePipe } from '@app/shared/pipes/safe-date.pipe';
import { ScrollPickerComponent } from './scroll-picker.component';
import { ScrollPickerItem } from './scroll-picker-item.model';

const items: ScrollPickerItem[] = [
  { id: 1, label: 'W 1', sublabel: '15 AUG' },
  { id: 2, label: 'W 2', date: '2024-08-22T00:00:00.000Z' },
  { id: 3, label: 'W 3', sublabel: '29 AUG', current: true },
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

  it('renders the label and sublabel for an item with a sublabel', () => {
    const button = fixture.nativeElement.querySelector('[data-id="1"]');
    expect(button.textContent).toContain('W 1');
    expect(button.textContent).toContain('15 AUG');
  });

  it('renders the label and formatted date for an item with a date', () => {
    const button = fixture.nativeElement.querySelector('[data-id="2"]');
    const expectedDate = new SafeDatePipe().transform('2024-08-22T00:00:00.000Z', 'd MMM');
    expect(button.textContent).toContain('W 2');
    expect(button.textContent).toContain(expectedDate);
  });

  it('applies selected highlight to the selected item', () => {
    const selectedButton = fixture.nativeElement.querySelector('[data-id="2"]');
    const otherButton = fixture.nativeElement.querySelector('[data-id="1"]');
    expect(selectedButton.classList).toContain('bg-surface-300');
    expect(otherButton.classList).not.toContain('bg-surface-300');
  });

  it('applies primary background to a current item', () => {
    const currentButton = fixture.nativeElement.querySelector('[data-id="3"]');
    expect(currentButton.classList).toContain('bg-primary');
    expect(currentButton.classList).toContain('text-primary-contrast');
    expect(currentButton.classList).not.toContain('bg-surface-300');
  });

  it('emits selected id when item is clicked', () => {
    let emitted: number | undefined;
    fixture.componentInstance.selected.subscribe((id) => (emitted = id));

    const button = fixture.nativeElement.querySelector('[data-id="1"]') as HTMLButtonElement;
    button.click();

    expect(emitted).toBe(1);
  });
});
