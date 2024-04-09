import { Component, OnInit, Signal, inject, input, output, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { PostService } from "@app/shared/data/post.service";
import { Post, User } from "@app/shared/interfaces";
import { skip, switchMap } from "rxjs";
import { LikeBtnComponent } from "./like-btn.component";
import { RouterLink } from "@angular/router";
import { PluralPipe } from "@app/shared/utils/plural.pipe";
import { CommentSectionComponent } from "@app/shared/components/comment-section/comment-section.component";
import { DatePipe } from "@angular/common";
import { AuthStore } from "@app/shared/data/auth.store";
import { postAddState } from "../../ui/animations";

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
                [(liked)]="liked"
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
    remove = output<string>();
    
    liked = signal<boolean>(false)
    likesCount = signal<number>(0)

    ngOnInit(): void {
      // comment.
        this.liked.set(this.post().liked)
        this.likesCount.set(this.post().likesCount)
    }


    constructor(){
        toObservable(this.liked).pipe(
            skip(1),
            switchMap((like) =>
                like 
                    ? this.postService.like(this.post()._id) 
                    : this.postService.unlike(this.post()._id)
            ),
            takeUntilDestroyed()
        ).subscribe(({post}) => 
            this.likesCount.set(post.likesCount)
        )
    }


}