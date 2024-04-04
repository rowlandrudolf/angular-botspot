import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  input,
  output,
} from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// import { LoginStatus } from '../data-access/login.service';
import { CredentialsType } from '@app/shared/interfaces/user.interface';

@Component({
  selector: 'login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
  
    @if(!loginForm.controls.email.valid && (loginForm.controls.email.dirty ||
    form.submitted)){
    <span class="error">Please enter a valid email</span>
    } @if(!loginForm.controls.password.valid &&
    (loginForm.controls.password.dirty || form.submitted)){
    <span class="error">Please enter password</span>
    }
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" #form="ngForm">
      <input type="text" placeholder="Email" formControlName="email" />
      <input
        type="password"
        placeholder="Password"
        formControlName="password"
      />
      <button type="submit" [disabled]="!loginForm.valid">Sign in</button>
    </form>
  `,
  styles: ``,
})
export default class LoginFormComponent {
  status = input();
  login = output<CredentialsType>();

  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      this.login.emit(credentials);
    }
  }
}
