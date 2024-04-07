import { DatePipe, JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule,  } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Post } from '@app/shared/interfaces';
import { PluralPipe } from '@app/shared/utils/plural.pipe';
import PostItemComponent from '@app/shared/components/post-item/post-item.component';

@Component({
  selector: 'feed',
  standalone: true,
  imports: [ JsonPipe, DatePipe, FormsModule, RouterLink,PluralPipe, PostItemComponent ],
  providers: [],
  template: `
      <ul class="app-feed-list">
      @for(post of posts(); track post._id) {
        <post-item [post]="post" (remove)="removePost.emit($event)"/>
      }
    </ul>
      
  `,
})
export default class FeedComponent {
  posts = input<Post[]>([])
  count = input<number>(0)
  removePost = output<Post['_id']>()
}
