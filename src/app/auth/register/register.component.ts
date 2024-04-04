import { Component, effect, inject, signal } from '@angular/core';
import { AuthStore } from '@app/shared/data/auth.store';
import { Router, RouterLink } from '@angular/router';
import { RegisterFormComponent } from './ui/register-form';

export type LoginStatus = 'idle' | 'pending' | 'success' | 'error';

@Component({
  selector: 'register',
  standalone: true,
  imports: [RegisterFormComponent, RouterLink],
  providers: [],
  template: `
    <div class="user-form text-center">
      <h1 class="">Sign up</h1>
      <p>Already a user? <a [routerLink]="['/auth', 'login']">Sign in</a></p>
      @if (authStore.error()) {
      <span class="error">
        {{ authStore.error() }}
      </span>
      }
      <register-form (register)="authStore.register($event)" />
    </div>
  `,
})
export default class RegisterComponent {
  authStore = inject(AuthStore);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authStore.user() !== null) {
        this.router.navigateByUrl('home');
      }
    });
  }
}
