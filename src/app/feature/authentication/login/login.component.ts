import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { UserCredentialsModel } from '@app/core/api';
import { UserSessionStore } from '@app/core/store';
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
  private userSession = inject(UserSessionStore);
  protected jwt = this.userSession.jwt;

  private destroyRef = inject(DestroyRef);

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userCredentials: UserCredentialsModel = {
      ...this.form.getRawValue(),
    };

    this.login(userCredentials);
  }

  private login(userCredentials: UserCredentialsModel) {
    this.working.set(true);

    this.userSession
      .authenticate(userCredentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.form.markAsPristine();
          this.working.set(false);
        }),
      )
      .subscribe({
        next: (result) => {
          // TODO: User feedback
          console.log(result);
        },
        error: () => {
          // TODO: User feedback
          console.log('Login failed');
        },
      });
  }
}
