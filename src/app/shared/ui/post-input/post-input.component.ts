import {
  Component,
  EventEmitter,
  Input,
  Output,
  Signal,
  input,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { OutletContext, RouterLink } from '@angular/router';
import { AuthUser } from '@app/shared/interfaces/user.interface';

@Component({
  selector: 'post-input',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="post-input-wrap">
      <div class="user-info">
        <span class="avatar sm">
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed={{currentUser().username }}"
          />
        </span>
        <div class="username-date">
          <a [routerLink]="['/profiles', currentUser().username]">
            {{ currentUser().username }}:
          </a>
        </div>
      </div>
      <!-- <span class="error">Error</span> -->
      <input
        type="text"
        [formControl]="postCtrl"
        placeholder="Say something..."
      />
      <button (click)="onClick()">📌 Post</button>
    </div>
  `,
  styles: ``,
})
export class PostInputComponent {
  submit = output<string>();
  currentUser = input.required<AuthUser>();
  postCtrl = new FormControl('', [Validators.required]);

  onClick() {
    if(!this.postCtrl.valid) return
    this.submit.emit(this.postCtrl.value!);
    this.postCtrl.reset();
  }
}
