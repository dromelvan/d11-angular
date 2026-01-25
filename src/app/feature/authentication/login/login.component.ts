import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { UserCredentialsModel } from '@app/core/api';
import { UserSessionService } from '@app/core/auth';
import {
  ButtonSubmitComponent,
  CheckboxComponent,
  InputPasswordComponent,
  InputTextComponent,
} from '@app/shared/form';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage,
    InputTextComponent,
    ButtonSubmitComponent,
    CheckboxComponent,
    InputPasswordComponent,
    InputTextComponent,
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
  protected jwt = this.userSession.jwt;

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
        finalize(() => {
          this.working.set(false);
        }),
      )
      .subscribe({
        next: (result) => {
          // TODO: User feedback
          console.log(result);
        },
        error: () => {},
      });
  }
}
