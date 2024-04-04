import { Component, effect, inject, signal } from "@angular/core";
import LoginFormComponent from "./ui/login-form.componet";
import { CredentialsType } from "@app/shared/interfaces/user.interface";
import { AuthStore } from "@app/shared/data/auth.store";
import { Router, RouterLink } from "@angular/router";

export type LoginStatus = 'idle' | 'pending' | 'success' | 'error';


@Component({
    selector: 'login',
    standalone: true,
    imports: [LoginFormComponent,RouterLink],
    providers: [],
    template: `
    <div class="user-form text-center">
        <h1 class="">Sign In</h1>
        <p>Need an account? <a [routerLink]="['/auth','register']">Sign up</a></p>
        @if(authStore.error()){
          <span class="error">Invalid email or password</span>
        }
        <login-form
            (login)="authStore.login($event)"
        />
      </div>
   
    `
})
export default class LoginComponent {
    authStore = inject(AuthStore);
    router = inject(Router)

    constructor() {
        effect(() => {
          if (this.authStore.user() !== null) {
            this.router.navigateByUrl('home');
          }
        });
      }

}