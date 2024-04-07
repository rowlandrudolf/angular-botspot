import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import FeedComponent from '@app/shared/ui/feed/feed.component';
import { PostsStore } from '@app/shared/data/posts.store';
import { PaginationComponent } from '@app/shared/ui/pagination/pagination.component';
import { FeedTogglerComponent } from './ui/feed-toggle.component';
import { StorageService } from '@app/shared/data/storage.service';
import { AuthStore } from '@app/shared/data/auth.store';
import { PostInputComponent } from '@app/shared/ui/post-input/post-input.component';
import { SpinnerComponent } from '@app/shared/ui/spinner/spinner.component';

@Component({
  selector: 'shell',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    PostInputComponent,
    FeedComponent,
    PaginationComponent,
    FeedTogglerComponent,
    SpinnerComponent
  ],
  providers: [PostsStore],
  template: `
    <div>
      <feed-toggler
        [path]="postsStore.filter.path()"
        [currentUser]="authStore.user()"
        (toggleFeed)="onUpdatePath($event)"
      />

      @if(authStore.user() !== null){
      <post-input
        [currentUser]="authStore.user()!"
        (submit)="postsStore.submitPost($event)" />
      } 
      <spinner [loading]="postsStore.loading()" />
      
      @if (postsStore.filter.path() === 'feed' && postsStore.posts().length === 0) {
        <p>No posts yet! Use the <span class="explore" (click)="onUpdatePath('')">Explore</span> feed to find users!</p>
      }

      <feed
        [posts]="postsStore.posts()"
        [count]="postsStore.count()"
        (removePost)="postsStore.removePost($event)" />

      <pagination
        [total]="postsStore.count()"
        [skip]="postsStore.filter.skip()"
        (skipChange)="postsStore.setSkip($event)"
      />
    </div>
  `,
  styles: `
    .explore {
      color: rgb(127,230,147);
      text-decoration: underline;
      cursor: pointer;
    }
  `,
})
export default class ShellComponent implements OnInit {
  readonly postsStore = inject(PostsStore);
  readonly authStore = inject(AuthStore);
  readonly storageService = inject(StorageService);

  ngOnInit(): void {
    this.initPath();
    const filter = this.postsStore.filter;
    this.postsStore.loadPosts(filter);
  }

  initPath() {
    let path = '';
    if (this.authStore.user() !== null) {
      path = this.storageService.get('currentPath') ?? 'feed';
    }
    this.postsStore.setPath(path);
  }

  onUpdatePath(path: string) {
    this.storageService.set('currentPath', path);
    this.postsStore.setPath(path);
  }
}
