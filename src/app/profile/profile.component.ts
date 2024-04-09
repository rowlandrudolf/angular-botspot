import { Component, computed, inject, input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import FeedComponent from '@app/shared/ui/feed/feed.component';
import { PostsStore } from '@app/shared/data/posts.store';
import { PaginationComponent } from '@app/shared/ui/pagination/pagination.component';
import { Location } from '@angular/common';
import { AuthStore } from '@app/shared/data/auth.store';
import { FollowButtonComponent } from './ui/follow-button.component';
import { PostInputComponent } from '@app/shared/ui/post-input/post-input.component';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SpinnerComponent } from '@app/shared/ui/spinner/spinner.component';
import { exhaustMap, filter, map, pipe, switchMap, tap } from 'rxjs';
import { ProfileService } from './data/profile.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalState } from '@ngrx/signals';
import { Profile } from '@app/shared/interfaces';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [
    FeedComponent, 
    PostInputComponent,
    PaginationComponent, 
    FollowButtonComponent, 
    SpinnerComponent
  ],
  providers: [PostsStore, Location],
  template: `
    <button
      class="control-btn"
      (click)="location.back()"
      style="margin-top: 1rem;" >
      &#8678; Back
    </button>
   
   
      <div class="profile-card glow">
          <img src="https://api.dicebear.com/7.x/bottts/svg?seed={{profile()?.username}}"/>
        <div class="profile-info">
          <h1>{{ profile()?.username }}</h1>
          <div class="follow-info">
            <div>
              <span class="count">{{ postsStore.count() }}</span> 
              <span class="label">posts</span>
            </div>
            <div>
              <span class="count">{{ followersCount() }}</span> 
              <span class="label">followers</span>
            </div>
            <div>
              <span class="count">{{ profile()?.followingCount }}</span> 
              <span class="label">following</span>
            </div>
          </div>
      
          @if(authStore.user() && !isCurrentUser()) {
            <follow-button
              [following]="following()"
              (toggleFollow)="toggleFollow($event)"
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
    @if(!postsStore.loading()){
      <feed
        [posts]="postsStore.posts()"
        [count]="postsStore.count()"
        (removePost)="postsStore.removePost($event)"
      />
    }

    <pagination
      [total]="postsStore.count()"
      [skip]="postsStore.filter.skip()"
      (skipChange)="postsStore.setSkip($event)"
    />
  `,
})
export default class ProfileComponent {
  location = inject(Location)
  activedRoute = inject(ActivatedRoute)
  authStore = inject(AuthStore)
  profileService = inject(ProfileService)
  postsStore = inject(PostsStore)


  private readonly state = signalState({
    following: false,
    followersCount: 0
  })

  readonly following = this.state.following
  readonly followersCount =  this.state.followersCount

  profile = toSignal<Profile>(
    this.activedRoute.data
      .pipe(
        map(({profile}) => profile),
        tap(({username, following, followersCount}) => {
          this.postsStore.setPath(username);
          this.postsStore.loadPosts(this.postsStore.filter)
          patchState(this.state, {
            following,
            followersCount
          })
        })
      )
  )

  isCurrentUser = computed(() =>
    this.authStore.user()?._id === this.profile()?._id
  );

  toggleFollow = rxMethod<boolean>(
    pipe(
      exhaustMap((following) => 
        this.profileService.toggleFollow(following, this.profile()!.username)
      ),
      tapResponse({
        next: ({following, followersCount}) => 
          patchState(this.state, ({following, followersCount})
        ),
        error: console.error
      })
    )
  )
  
}