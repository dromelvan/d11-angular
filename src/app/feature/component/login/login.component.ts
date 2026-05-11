import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';
import { CurrentApiService, UserCredentialsModel } from '@app/core/api';
import { UserSessionService } from '@app/core/auth/user-session.service';
import { RouterService } from '@app/core/router/router.service';
import { MessageService } from 'primeng/api';
import {
  ButtonSubmitComponent,
  CheckboxComponent,
  InputPasswordComponent,
  InputTextComponent,
} from '@app/shared/form';
import { D11LionDarkImgComponent } from '@app/shared/img/d11-lion-dark-img/d11-lion-dark-img.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    ButtonSubmitComponent,
    CheckboxComponent,
    InputPasswordComponent,
    InputTextComponent,
    D11LionDarkImgComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  public readonly working = signal(false);

  protected form = inject(FormBuilder).nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    persistent: false,
  });
  private userSession = inject(UserSessionService);
  private routerService = inject(RouterService);
  private messageService = inject(MessageService);
  private currentApiService = inject(CurrentApiService);

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.working()) {
      return;
    }

    this.form.markAsPristine();

    this.login(this.form.getRawValue());
  }

  private login(userCredentials: UserCredentialsModel) {
    this.working.set(true);

    this.userSession
      .authenticate(userCredentials)
      .pipe(
        switchMap(() => this.currentApiService.getCurrent()),
        finalize(() => {
          this.working.set(false);
        }),
      )
      .subscribe({
        next: (current) => {
          if (current.matchWeek?.id != null) {
            this.routerService.navigateToMatchWeek(current.matchWeek.id);
          }
        },
        error: (response: HttpErrorResponse) => {
          if (response.status === 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Sign in failed',
              detail: 'Invalid email or password.',
            });
          }
        },
      });
  }
}
