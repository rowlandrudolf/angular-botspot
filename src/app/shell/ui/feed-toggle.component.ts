import { Component, EventEmitter, Input, Output, Signal, computed, input, output } from '@angular/core';
//import { AuthUser } from '@app/shared/interfaces/user.interface';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthUser } from '@app/shared/interfaces/user.interface';

interface TabItemInterface {
  title: string,
  path: string
}

@Component({
  selector: 'feed-toggler',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
     <ul class="feed-toggle">
        @for(tab of tabList(); track $index){
          <li (click)="onToggleFeed(tab.path)" [ngClass]="{'active': path() === tab.path }">
            <a routerLink="">{{tab.title}}</a>
          </li>
        }
     </ul>
  `,
  styles: ``
})
export class FeedTogglerComponent {
    path = input.required<string>()
    currentUser = input<AuthUser | null>(null)
    toggleFeed = output<string>();

    tabList: Signal<TabItemInterface[]> = computed(() => {

      const list: TabItemInterface[] = [
        {
          title: 'Explore...',
          path: ''
        },
      ]
      if(this.currentUser() !== null){
        list.unshift(
          {
            title: 'Following',
            path: 'feed'
          }
        )
      }
      return list
    })

    onToggleFeed(value: string){
       if(this.path() === value) return
       this.toggleFeed.emit(value)
    }

}