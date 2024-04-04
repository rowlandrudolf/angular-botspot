import { Component, Input, OnInit, inject, input, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthStore } from "@app/shared/data/auth.store";
import { CommentsStore } from "./data/comments.store";
import { RouterLink } from "@angular/router";
import { CommentService } from "./data/comment.service";
import { CommentForm } from "./ui/comment-input.component";
import { PluralPipe } from "@app/shared/utils/plural.pipe";
import { showCommentFormState } from "@app/shared/ui/animations";

@Component({
  selector: 'comment-section',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentForm, PluralPipe],
  providers: [CommentService, CommentsStore],
  template: `
    <div class="app-feed-item-comments flex space-between">
        <span> {{commentsStore.count() }} {{ 'comment' | plural: commentsStore.count() }}</span>
        @if(authStore.user() !== null && !showForm()){          
            <button class="control-btn" (click)="showForm.set(true)">Leave Comment 💬 </button>
        }
    </div>
    @if (authStore.user() !== null && showForm()) {
        <div style="overflow: hidden;">
        <comment-form
            @showCommentFormTrigger
            (submit)="onSubmit($event)" />
        </div>
    }
    <ul class="app-comment-list">
      @for (comment of commentsStore.comments(); track $index) {
      <li>
        <div class="username-date">
          <a [routerLink]="['/profiles', comment.author.username]">
            {{ comment.author.username }}
          </a>
          <small>{{ comment.createdAt | date : 'short' }}</small>
          @if(authStore.user() !== null && comment.author._id === authStore.user()?._id){
            <button class="control-btn" style="float:right;" (click)="commentsStore.remove(comment._id)">❌</button>
          }
        </div>
        <p>{{ comment.note }}</p>
      </li>
      }
    </ul>
  `,
  styles: ``,
  animations: [
    showCommentFormState
  ],
})
export class CommentSectionComponent implements OnInit {
  postId = input.required<string>();
  commentsStore = inject(CommentsStore);
  authStore = inject(AuthStore);
  showForm = signal<boolean>(false);

  ngOnInit(): void {
    this.commentsStore.loadComments(this.postId());
  }

  onSubmit(note:string){
    this.commentsStore.submit(note);
    this.showForm.set(false);
  }
}
