import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TransferWindowApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeTransferWindow } from '@app/test';
import { CreateTransferWindowFormComponent } from './create-transfer-window-form.component';

describe('CreateTransferWindowFormComponent', () => {
  let fixture: ComponentFixture<CreateTransferWindowFormComponent>;
  let component: CreateTransferWindowFormComponent;
  let mockTransferWindowApiService: { createTransferWindow: ReturnType<typeof vi.fn> };
  let mockRouterService: { navigateToTransferWindow: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockTransferWindowApiService = {
      createTransferWindow: vi.fn().mockReturnValue(of(fakeTransferWindow())),
    };
    mockRouterService = { navigateToTransferWindow: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [CreateTransferWindowFormComponent],
      providers: [
        { provide: TransferWindowApiService, useValue: mockTransferWindowApiService },
        { provide: RouterService, useValue: mockRouterService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTransferWindowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders datetime and transferDayDelay fields', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('#datetime')).toBeInTheDocument();
    expect(host.querySelector('#transferDayDelay')).toBeInTheDocument();
  });

  it('defaults datetime to today at 22:00', () => {
    const datetime = component['form'].controls.datetime.value;
    const today = new Date();

    expect(datetime).not.toBeNull();
    expect(datetime?.getFullYear()).toBe(today.getFullYear());
    expect(datetime?.getMonth()).toBe(today.getMonth());
    expect(datetime?.getDate()).toBe(today.getDate());
    expect(datetime?.getHours()).toBe(22);
    expect(datetime?.getMinutes()).toBe(0);
    expect(datetime?.getSeconds()).toBe(0);
  });

  it('defaults transferDayDelay to 1', () => {
    expect(component['form'].controls.transferDayDelay.value).toBe(1);
  });

  // onSubmit --------------------------------------------------------------------------------------

  describe('onSubmit', () => {
    it('marks all fields as touched when datetime is missing', () => {
      component['form'].controls.datetime.setValue(null);

      component['onSubmit']();

      expect(component['form'].touched).toBe(true);
    });

    it('does not call createTransferWindow when datetime is missing', () => {
      component['form'].controls.datetime.setValue(null);

      component['onSubmit']();

      expect(mockTransferWindowApiService.createTransferWindow).not.toHaveBeenCalled();
    });

    it('marks all fields as touched when transferDayDelay is missing', () => {
      component['form'].controls.transferDayDelay.setValue(null);

      component['onSubmit']();

      expect(component['form'].touched).toBe(true);
    });

    it('does not call createTransferWindow when transferDayDelay is missing', () => {
      component['form'].controls.transferDayDelay.setValue(null);

      component['onSubmit']();

      expect(mockTransferWindowApiService.createTransferWindow).not.toHaveBeenCalled();
    });

    it('calls createTransferWindow with form values on valid submit', async () => {
      const transferWindow = fakeTransferWindow();
      mockTransferWindowApiService.createTransferWindow.mockReturnValue(of(transferWindow));
      const datetime = new Date('2024-01-15T14:30:00');
      const expectedDatetime = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19);
      component['form'].setValue({ datetime, transferDayDelay: 1 });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockTransferWindowApiService.createTransferWindow).toHaveBeenCalledWith({
        datetime: expectedDatetime,
        transferDayDelay: 1,
      });
    });

    it('navigates to the created transfer window on success', async () => {
      const transferWindow = fakeTransferWindow();
      mockTransferWindowApiService.createTransferWindow.mockReturnValue(of(transferWindow));
      component['form'].setValue({
        datetime: new Date('2024-01-15T14:30:00'),
        transferDayDelay: 1,
      });

      component['onSubmit']();
      TestBed.tick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockRouterService.navigateToTransferWindow).toHaveBeenCalledWith(transferWindow.id);
    });
  });
});
