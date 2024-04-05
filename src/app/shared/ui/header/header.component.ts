import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@app/shared/data/auth.store';

@Component({
  selector: 'bot-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="app-header">
      <div class="container flex space-between">
        <div class="logo flex">
          <a routerLink="/home"><img src="assets/robocat.png" alt="botspot"></a>
          <h1><a routerLink="/home">BOTSPOT</a></h1>
        </div>
        <nav>
          <ul class="flex">
            @if (authStore.user() === null) {
            <li><a [routerLink]="['auth', 'register']">Sign up</a></li>
            <li><a [routerLink]="['auth', 'login']">Sign in</a></li>
            } @else { @defer (on timer(50)) {
            <li class="username">
              <span class="avatar sm">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed={{authStore.user()?.username}}"/>
              </span>
              <a [routerLink]="['profiles', authStore.user()?.username]">{{
                authStore.user()?.username
              }}</a>
            </li>
            <li><a (click)="authStore.logout()">Logout</a></li>
            } }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: `
  .app-header {
    background-color: black;
    border-bottom: 1px solid gray;
    padding: .5rem 0;
    font-size: 18px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
      .logo {
          align-items: center;
          gap: 1rem;
          font-family: 'Sixtyfour';//'Rubik Doodle Shadow';
          font-size: 1rem;
          color:#93E67F;
          img{
            width: 60px;
          }
      }
  }
  nav ul {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    padding: 0; 
    margin: 0;
    li {
    
        display: flex;
        align-items: center;
    }

    li.username {
        gap: 1rem;

        a {
            color:#93E67F;
            font-weight: bold;
            cursor: pointer;
        }
    }
  }
  `,
})
export class HeaderComponent {
  authStore = inject(AuthStore);
}