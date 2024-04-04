import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import FeedComponent from '@app/shared/ui/feed/feed.component';
import { PostsStore } from '@app/shared/data/posts.store';
import { PaginationComponent } from '@app/shared/ui/pagination/pagination.component';
import {  Location } from '@angular/common';
import { AuthStore } from '@app/shared/data/auth.store';
import { FollowButtonComponent } from './ui/follow-button.component';
import {ProfileStore} from './data/profile.store';
import { PostInputComponent } from '@app/shared/ui/post-input/post-input.component';
import { Profile } from '@app/shared/interfaces';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [FeedComponent, PostInputComponent ,PaginationComponent, FollowButtonComponent],
  providers: [PostsStore, ProfileStore, Location],
  template: `
    <button
      class="control-btn"
      (click)="location.back()"
      style="margin-top: 1rem;" >
      &#8678; Back
    </button>
    <div class="profile-card glow">
      <div class="avatar lg">
        <img
          src="https://api.dicebear.com/7.x/bottts/svg?seed={{
            profileStore.username()
          }}"
        />
      </div>
      <div class="profile-info lg">
        <h1>{{ profileStore.username() }}</h1>
        <div class="follow-info">
          <div class="text-center">
            {{ postsStore.count() }} <span>posts</span>
          </div>
          <div class="text-center">
            {{ profileStore.followersCount() }} <span>followers</span>
          </div>
          <div class="text-center">
            {{ profileStore.followingCount() }} <span>following</span>
          </div>
        </div>
        @if(authStore.user() && !isCurrentUser()) {
          <follow-button
            [following]="profileStore.following()"
            (toggleFollow)="profileStore.toggleFollow()"
          />
        }
      </div>
    </div>
    @if(isCurrentUser()){
      <post-input
        [currentUser]="authStore.user()!"
        (submit)="postsStore.submitPost($event)" />
    }
    <feed
      [currentUser]="authStore.user()"
      [posts]="postsStore.posts()"
      [count]="postsStore.count()"
      (toggleLike)="postsStore.toggleLike($event)"
      (removePost)="postsStore.removePost($event)"
    />

    <pagination
      [total]="postsStore.count()"
      [skip]="postsStore.filter.skip()"
      (skipChange)="postsStore.setSkip($event)"
    />
  `,
  styles: `
  .control-btn {
    color: #93E67F
  }
  .profile-card {
      background: linear-gradient(180deg,#151515,#090909 100%);
      border-radius: 10px;
      border: 1px solid #222;
      display: flex;
      gap: 2rem;
      padding: 2rem;
      margin: 2rem 0 3rem 0;
      align-items: stretch;
  
  }
  .profile-info{
    display: flex;
    flex-direction: column;
    width: 100%;
    flex-grow: 1;

    h1 {
      letter-spacing: 1px;
      text-shadow: 1px 1px black;
    }
    .follow-info{
      display: flex;
      justify-content: space-around;
      font-size: 22px;
      margin: 2rem 0;
      span {
        display: block;
        font-size: 14px !important;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }
    button {
      display:block;
    }
  }
  `,
})
export default class ProfileComponent implements OnInit {
  location = inject(Location);
  authStore = inject(AuthStore);
  postsStore = inject(PostsStore);
  profileStore = inject(ProfileStore)

  profile = input.required<Profile>();
  profile$ = toObservable<Profile>(this.profile);

  isCurrentUser = computed(() =>
    this.authStore.user()?._id === this.profileStore._id()
  );

  constructor(){
    const filter = this.postsStore.filter
    this.profile$.pipe(takeUntilDestroyed()).subscribe(({username}) => {
      this.postsStore.setPath(username);
      this.postsStore.loadPosts(filter);
    })
  }

  ngOnInit(): void {
    this.profileStore.setProfile(this.profile())
  }

}
