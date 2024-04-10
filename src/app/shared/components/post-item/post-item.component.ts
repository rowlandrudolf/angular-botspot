import { Component, OnInit, Signal, computed, inject, input, output, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { PostService } from "@app/shared/data/post.service";
import { Post, User } from "@app/shared/interfaces";
import { Subject, skip, switchMap, tap } from "rxjs";
import { LikeBtnComponent } from "./like-btn.component";
import { RouterLink } from "@angular/router";
import { PluralPipe } from "@app/shared/utils/plural.pipe";
import { CommentSectionComponent } from "@app/shared/components/comment-section/comment-section.component";
import { DatePipe } from "@angular/common";
import { AuthStore } from "@app/shared/data/auth.store";
import { postAddState } from "../../ui/animations";
import { signalState } from "@ngrx/signals";

@Component({
    selector: 'post-item',
    standalone: true,
    imports: [ 
      LikeBtnComponent, 
      RouterLink, 
      PluralPipe, 
      DatePipe,
      CommentSectionComponent 
    ],
    providers: [],
    template: `
    
    <li class="app-feed-item" @postAddTrigger>
        <div class="user-info">
          <span class="avatar sm"> 
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed={{post().author.username}}"/>
          </span>
          <div class="username-date">
            <a [routerLink]="['/profiles', post().author.username]">{{
              post().author.username
            }}</a>
            <small>{{ post().createdAt | date : 'short' }}</small>
          </div>
          <div class="controls">
            @if(authStore.user() !== null && authStore.user()?._id === post().author._id){
              <button class="control-btn" (click)="remove.emit(post()._id)"> ❌ </button>
            } 
            @if(authStore.user() !== null ){
              <like-btn 
                [likesCount]="likesCount()"
                [liked]="liked()"
                (likedChange)="like$.next($event)"
              />
            } @else {
            <button class="control-btn" [disabled]="true">
              👍 {{ likesCount() }} {{ 'like' | plural: likesCount() }} 
            </button>
            }
          </div>
        </div>
        <div class="app-feed-item-body">
            <p>{{ post().body }}</p>
        </div>
        <comment-section [postId]="post()._id" />
      </li>
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
export default class PostItemComponent implements OnInit {
    authStore = inject(AuthStore)
    postService = inject(PostService)

    post = input.required<Post>()
    remove = output<Post['_id']>();

    private state = signal({
      liked: false,
      likesCount: 0
    })

    liked = computed(() => this.state().liked)
    likesCount = computed(() => this.state().likesCount)

    like$ = new Subject<boolean>()

    constructor(){
      this.like$.pipe(
        switchMap((like) =>
          this.postService.toggleLike(like, this.post()._id)
        ),
        takeUntilDestroyed()
      ).subscribe(({liked, likesCount}) => 
        this.state.update((_) => ({
          likesCount,
          liked
        }))
      )
    }

    ngOnInit(): void {
      this.state.update((_) => ({
        liked: this.post().liked,
        likesCount: this.post().likesCount,
      }))
    }
}