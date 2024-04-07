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
import { SpinnerComponent } from '@app/shared/ui/spinner/spinner.component';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [FeedComponent, PostInputComponent ,PaginationComponent, FollowButtonComponent, SpinnerComponent],
  providers: [PostsStore, ProfileStore, Location],
  template: `
    <button
      class="control-btn"
      (click)="location.back()"
      style="margin-top: 1rem;" >
      &#8678; Back
    </button>
    <div class="profile-card glow">
        <img
           [src]="imgUrl()"
        />
      <div class="profile-info">
        <h1>{{ profileStore.username() }}</h1>
        <div class="follow-info">
          <div>
            <span class="count">{{ postsStore.count() }}</span> 
            <span class="label">posts</span>
          </div>
          <div>
            <span class="count">{{ profileStore.followersCount() }}</span> 
            <span class="label">followers</span>
          </div>
          <div>
            <span class="count">{{ profileStore.followingCount() }}</span> 
            <span class="label">following</span>
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
    <spinner [loading]="postsStore.loading()"/>
    <feed
      [posts]="postsStore.posts()"
      [count]="postsStore.count()"
      (removePost)="postsStore.removePost($event)"
    />

    <pagination
      [total]="postsStore.count()"
      [skip]="postsStore.filter.skip()"
      (skipChange)="postsStore.setSkip($event)"
    />
  `,
  styles: `
  `,
})
export default class ProfileComponent {
  location = inject(Location);
  authStore = inject(AuthStore);
  postsStore = inject(PostsStore);
  profileStore = inject(ProfileStore);
  activedRoute = inject(ActivatedRoute);

  imgUrl = computed(() => `https://api.dicebear.com/7.x/bottts/svg?seed=${this.profileStore.username()}`)

  isCurrentUser = computed(() =>
    this.authStore.user()?._id === this.profileStore._id()
  );

  constructor(){
    const filter = this.postsStore.filter
    this.activedRoute.data.pipe(takeUntilDestroyed()).subscribe(({profile}) => {
      this.profileStore.setProfile(profile);
      this.postsStore.setPath(profile.username);
      this.postsStore.loadPosts(filter);
    });
  }

}
