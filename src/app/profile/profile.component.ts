import { Component, OnInit, computed, inject, input, signal} from '@angular/core';
import FeedComponent from '@app/shared/ui/feed/feed.component';
import { PostsStore } from '@app/shared/data/posts.store';
import { PaginationComponent } from '@app/shared/ui/pagination/pagination.component';
import { Location } from '@angular/common';
import { AuthStore } from '@app/shared/data/auth.store';
import { FollowButtonComponent } from './ui/follow-button.component';
import { PostInputComponent } from '@app/shared/ui/post-input/post-input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpinnerComponent } from '@app/shared/ui/spinner/spinner.component';
import { Subject, switchMap } from 'rxjs';
import { ProfileService } from './data/profile.service';
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
          <img src="https://api.dicebear.com/7.x/bottts/svg?seed={{profile().username}}"/>
        <div class="profile-info">
          <h1>{{ profile().username }}</h1>
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
              <span class="count">{{ profile().followingCount }}</span> 
              <span class="label">following</span>
            </div>
          </div>
      
          @if(authStore.user() && !isCurrentUser()) {
            <follow-button
              [following]="following()"
              (followingChange)="follow$.next($event)"
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
export default class ProfileComponent implements OnInit {
  location = inject(Location)
  authStore = inject(AuthStore)
  profileService = inject(ProfileService)
  postsStore = inject(PostsStore)

  profile = input.required<Profile>();

  private readonly state = signal({
    following: false,
    followersCount: 0
  })

  following = computed(() => this.state().following)
  followersCount = computed(() => this.state().followersCount)

  isCurrentUser = computed(() =>
    this.authStore.user()?._id === this.profile()?._id
  );

  follow$ = new Subject<boolean>()

  constructor(){
    this.follow$.pipe(
      switchMap((follow) =>
        this.profileService.toggleFollow(follow, this.profile().username)
      ),
      takeUntilDestroyed()
    ).subscribe(({following, followersCount}) => 
      this.state.update((_) => ({
        following,
        followersCount
      }))
    )
  }

  ngOnInit(): void {
    this.postsStore.setPath(this.profile().username)
    this.postsStore.loadPosts(this.postsStore.filter)
    this.state.update((_) => ({
      following: this.profile().following,
      followersCount: this.profile().followersCount
    }))
  }


}