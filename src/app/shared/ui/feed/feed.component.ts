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

@Component({
  selector: 'feed',
  standalone: true,
  imports: [JsonPipe, DatePipe, FormsModule, RouterLink, LikeButtonComponent, PluralPipe, CommentSectionComponent],
  providers: [],
  template: `
      <ul class="app-feed-list">
      @for(post of posts(); track post._id) {
      <li class="app-feed-item" @postAddTrigger>
        <div class="user-info">
          <span class="avatar sm"> 
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed={{post.author.username}}"/>
          </span>
          <div class="username-date">
            <a [routerLink]="['/profiles', post.author.username]">{{
              post.author.username
            }}</a>
            <small>{{ post.createdAt | date : 'short' }}</small>
          </div>
          <div class="controls">
            @if(currentUser() !== null && currentUser()?._id === post.author._id){
              <button class="control-btn" (click)="removePost.emit(post._id)"> ❌ </button>
            } 
            @if(currentUser() !== null ){
              <like-button
                [likesCount]="post.likesCount"
                [liked]="post.liked"
                (toggle)="toggleLike.emit(post)"
              />
            } @else {
            <button class="control-btn" [disabled]="true">
              👍 {{ post.likesCount}} {{ 'like' | plural: post.likesCount }} 
            </button>
            }
          </div>
        </div>
        <div class="app-feed-item-body">
            <p>{{ post.body }}</p>
        </div>
        <comment-section [postId]="post._id" />
      </li>
      }
    </ul>
      
  `,
  styles: `
  .controls {
    display: flex;
    gap: .5rem;
  }
  `,
  animations: [
    postAddState
  ]
})
export default class FeedComponent {
  currentUser = input<AuthUser | null>(null)
  posts = input<Post[]>([])
  count = input<number>(0)
  toggleLike = output<Post>()
  removePost = output<Post['_id']>()
}
