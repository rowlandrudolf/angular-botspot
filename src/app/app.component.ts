import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthStore } from './shared/data/auth.store';
import { JsonPipe } from '@angular/common';
import { HeaderComponent } from './shared/ui/header/header.component';
import { fadeAnimation } from './shared/ui/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, JsonPipe, HeaderComponent],
  template: `
    <bot-header/>
    <main class="container-md"[@fadeAnimation]="outlet.isActivated ? outlet.activatedRoute : ''" >
      <router-outlet #outlet="outlet" />
    </main>
  `,
  animations: [
    fadeAnimation
  ]
})
export class AppComponent {
  authStore = inject(AuthStore)
}
