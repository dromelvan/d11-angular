import { Component } from '@angular/core';
import { LoginComponent } from '@app/feature/authentication/login/login.component';

@Component({
  selector: 'app-login-page',
  imports: [LoginComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {}
