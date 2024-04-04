import { Component, EventEmitter, Input, Output, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


import { CommonModule } from '@angular/common';

import { toSignal } from '@angular/core/rxjs-interop';
import { UsernameAvailableValidator } from '../utils/username-available.validator';
import { UsernameValidationMsgPipe } from '../utils/username-validation-msg.pipe';
import { CredentialsType } from '@app/shared/interfaces/user.interface';
import { passwordMatchValidator } from '../utils/password-match.validator';


@Component({
  selector: 'register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UsernameValidationMsgPipe],
  template: `
    @if((registerForm.controls.email.dirty || form.submitted) && !registerForm.controls.email.valid) {
          <span class="error">Please provide a valid email</span>
    }
    
    @if((registerForm.controls.username.dirty || form.submitted)) {
      {{ usernameStatus() | usernameMessage }} 
      @if(registerForm.controls.username.hasError('pattern')){
        <span class="error">Usernames must be betwen 3 and 12 vaild characters.</span>
      }
      @if(registerForm.controls.username.hasError('required')){
        <span class="error">Please provide a username.</span>
      }
    }
   

    @if(registerForm.hasError('passwordMatch') && (registerForm.controls.confirmPassword.dirty || form.submitted)){
      <span class="error">⚠️ Passwords do not match</span>
    }
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" #form="ngForm">
        <input type="email" placeholder="Email" formControlName="email"/>
        <input type="text" placeholder="Username" formControlName="username"/>  
        <input type="password" placeholder="Password" formControlName="password"/>
        <input type="password" placeholder="Confirm password" formControlName="confirmPassword"/>
      <button type="submit" [disabled]="!registerForm.valid"> Register </button>
    </form>

  `,
  styles: ``
})
export class RegisterFormComponent {
//  @Input({ required: true }) status!: RegisterStatus;
//   @Output() register = new EventEmitter<Credentials>();
 // error = input<string[] | null>(null);
  register = output<CredentialsType>()

  private fb = inject(FormBuilder)
  private usernameAvailableValidator = inject(UsernameAvailableValidator)

  registerForm = this.fb.nonNullable.group({
    email: ['',[ Validators.required, Validators.email ]],
    username: ['', 
      [Validators.required,
      Validators.pattern('^[a-zA-Z0-9_-]{3,12}$'),], 
      this.usernameAvailableValidator.validate.bind(
        this.usernameAvailableValidator
      ) 
    ],
    password: ['',[Validators.required, Validators.minLength(8)]],
    confirmPassword: ['',[Validators.required]],
  },
  {
    validators: [passwordMatchValidator]
  })

  usernameStatus = toSignal(this.registerForm.controls.username.statusChanges);

  onSubmit(){
    if(this.registerForm.valid){
      const { confirmPassword, ...credentials } = this.registerForm.getRawValue();
      this.register.emit(credentials);
    }
  }
}