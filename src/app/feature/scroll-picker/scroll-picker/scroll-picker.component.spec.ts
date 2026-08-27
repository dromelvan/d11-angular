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

  it('renders the header label when provided', () => {
    fixture.componentRef.setInput('items', [{ id: 1, label: 'W 1', header: 'Season' }]);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('[data-id="1"]');
    expect(button.textContent).toContain('Season');
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

  it('applies bg-primary-300 to the selected non-current item', () => {
    const selectedButton = fixture.nativeElement.querySelector('[data-id="2"]');
    const otherButton = fixture.nativeElement.querySelector('[data-id="1"]');
    expect(selectedButton.classList).toContain('bg-primary-300');
    expect(otherButton.classList).not.toContain('bg-primary-300');
  });

  it('applies border-white to the current item', () => {
    const currentButton = fixture.nativeElement.querySelector('[data-id="3"]');
    expect(currentButton.classList).toContain('border-white');
  });

  it('does not apply bg-primary-300 to the current item even when selected', () => {
    fixture.componentRef.setInput('selectedId', 3);
    fixture.detectChanges();

    const currentButton = fixture.nativeElement.querySelector('[data-id="3"]');
    expect(currentButton.classList).toContain('border-white');
    expect(currentButton.classList).not.toContain('bg-primary-300');
  });

  it('does not apply border-white to a non-current item', () => {
    const nonCurrentButton = fixture.nativeElement.querySelector('[data-id="1"]');
    expect(nonCurrentButton.classList).not.toContain('border-white');
  });

  it('emits selected id when item is clicked', () => {
    let emitted: number | undefined;
    fixture.componentInstance.selected.subscribe((id) => (emitted = id));

    const button = fixture.nativeElement.querySelector('[data-id="1"]') as HTMLButtonElement;
    button.click();

    expect(emitted).toBe(1);
  });

  it('applies normal-case to the label span of an item with preserveCase', () => {
    fixture.componentRef.setInput('items', [{ id: 1, label: 'Draft', preserveCase: true }]);
    fixture.componentRef.setInput('selectedId', 1);
    fixture.detectChanges();

    const labelSpan = fixture.nativeElement.querySelector('[data-id="1"] .app-text-header');
    expect(labelSpan.classList).toContain('normal-case');
  });

  it('does not apply normal-case to the label span of an item without preserveCase', () => {
    const labelSpan = fixture.nativeElement.querySelector('[data-id="1"] .app-text-header');
    expect(labelSpan.classList).not.toContain('normal-case');
  });

  it('calls scrollIntoView on the selected item on init with instant behavior', () => {
    vi.useFakeTimers();

    const freshFixture = TestBed.createComponent(ScrollPickerComponent);
    freshFixture.componentRef.setInput('items', items);
    freshFixture.componentRef.setInput('selectedId', 2);
    freshFixture.detectChanges();

    vi.runAllTimers();
    vi.useRealTimers();

    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      inline: 'center',
      block: 'nearest',
      behavior: 'instant',
    });
  });

  it('calls scrollIntoView with smooth behavior when selectedId changes', () => {
    vi.useFakeTimers();

    const freshFixture = TestBed.createComponent(ScrollPickerComponent);
    freshFixture.componentRef.setInput('items', items);
    freshFixture.componentRef.setInput('selectedId', 2);
    freshFixture.detectChanges();
    vi.runAllTimers();

    (HTMLElement.prototype.scrollIntoView as ReturnType<typeof vi.fn>).mockClear();

    freshFixture.componentRef.setInput('selectedId', 1);
    freshFixture.detectChanges();
    vi.runAllTimers();

    vi.useRealTimers();

    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth',
    });
  });
});
