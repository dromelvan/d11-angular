import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransferWindow, TransferWindowApiService } from '@app/core/api';
import { CreateTransferWindowRequestBody } from '@app/core/api/transfer-window/create-transfer-window-request-body.model';
import { RouterService } from '@app/core/router/router.service';
import {
  ButtonSubmitComponent,
  InputDatetimeComponent,
  InputNumberComponent,
} from '@app/shared/form';
import { SectionComponent } from '@app/shared/section/section.component';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-create-transfer-window-form',
  imports: [
    ReactiveFormsModule,
    ButtonSubmitComponent,
    InputDatetimeComponent,
    InputNumberComponent,
    SectionComponent,
  ],
  templateUrl: './create-transfer-window-form.component.html',
})
export class CreateTransferWindowFormComponent {
  protected form = inject(FormBuilder).group({
    datetime: new FormControl<Date | null>(
      new Date(new Date().setHours(22, 0, 0, 0)),
      Validators.required,
    ),
    transferDayDelay: new FormControl<number | null>(1, Validators.required),
  });

  protected readonly isLoading = computed(() => this.rxCreateTransferWindow.isLoading());

  private transferWindowInput = signal<CreateTransferWindowRequestBody | undefined>(undefined);

  private rxCreateTransferWindow = rxResource<
    TransferWindow,
    CreateTransferWindowRequestBody | undefined
  >({
    params: () => this.transferWindowInput(),
    stream: ({ params }) =>
      params != null ? this.transferWindowApiService.createTransferWindow(params) : EMPTY,
  });

  private routerService = inject(RouterService);
  private transferWindowApiService = inject(TransferWindowApiService);

  constructor() {
    effect(() => {
      const transferWindow = this.rxCreateTransferWindow.value();
      if (transferWindow != null) {
        this.routerService.navigateToTransferWindow(transferWindow.id);
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const rawValue = this.form.getRawValue();
    const datetime = rawValue.datetime;
    const transferDayDelay = rawValue.transferDayDelay;
    if (datetime == null || transferDayDelay == null) return;

    this.transferWindowInput.set({
      datetime: new Date(datetime.getTime() - datetime.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19),
      transferDayDelay,
    });
  }
}
