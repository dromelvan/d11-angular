import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonSubmitComponent,
  CheckboxComponent,
  InputPasswordComponent,
  InputTextComponent,
} from '@app/shared/form';
import { AuthenticationService, CredentialsModel } from '@app/core/authentication';
import { finalize } from 'rxjs';

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

  protected loggedIm = false;

  private destroyRef = inject(DestroyRef);
  private authenticationService = inject(AuthenticationService);
  private formBuilder = inject(FormBuilder);
  protected form = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    persistent: false,
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials: CredentialsModel = {
      ...this.form.getRawValue(),
    };

    this.login(credentials);
  }

  private login(credentials: CredentialsModel) {
    this.working.set(true);

    this.authenticationService
      .login(credentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.form.markAsPristine();
          this.working.set(false);
        }),
      )
      .subscribe({
        next: (result) => {
          console.log(result);
          this.loggedIm = true;
        },
        error: () => {
          console.log('Login failed');
          this.loggedIm = false;
        },
      });
  }
}
