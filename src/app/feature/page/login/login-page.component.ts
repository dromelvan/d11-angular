import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CurrentService } from '@app/core/current/current.service';
import { PageContextService } from '@app/core/page-context/page-context.service';
import { LoginFormComponent } from '@app/feature/form/login/login-form.component';

@Component({
  selector: 'app-login-page',
  imports: [LoginFormComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly currentService = inject(CurrentService);
  private readonly pageContextService = inject(PageContextService);

  constructor() {
    this.pageContextService.register(inject(DestroyRef), {
      title: signal('Sign In'),
      subtitle: computed(() => {
        const name = this.currentService.season()?.name;
        return name !== undefined ? `Season ${name}` : undefined;
      }),
      backgroundColor: signal(''),
    });
  }
}
