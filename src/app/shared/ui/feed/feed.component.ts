import { DatePipe, JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule,  } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Post } from '@app/shared/interfaces';
import { AuthUser } from '@app/shared/interfaces/user.interface';
import { LikeButtonComponent } from './like-button.component';
import { PluralPipe } from '@app/shared/utils/plural.pipe';
import { postAddState } from '../animations';
import { CommentSectionComponent } from '@app/shared/components/comment-section/comment-section.component';
import { PostInputComponent } from '../post-input/post-input.component';
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
