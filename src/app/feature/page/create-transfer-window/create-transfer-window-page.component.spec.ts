import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TransferWindowApiService } from '@app/core/api';
import { RouterService } from '@app/core/router/router.service';
import { fakeTransferWindow } from '@app/test';
import { CreateTransferWindowPageComponent } from './create-transfer-window-page.component';

describe('CreateTransferWindowPageComponent', () => {
  let fixture: ComponentFixture<CreateTransferWindowPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTransferWindowPageComponent],
      providers: [
        {
          provide: TransferWindowApiService,
          useValue: { createTransferWindow: vi.fn().mockReturnValue(of(fakeTransferWindow())) },
        },
        { provide: RouterService, useValue: { navigateToTransferWindow: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTransferWindowPageComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('renders the create transfer window component', () => {
    expect(fixture.nativeElement.querySelector('app-create-transfer-window')).toBeInTheDocument();
  });
});
