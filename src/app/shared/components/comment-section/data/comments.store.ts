import { computed, inject } from "@angular/core";
import { Comment } from "@app/shared/interfaces"
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { concatMap, exhaustMap, filter, pipe, switchMap, tap } from "rxjs";
import { CommentService } from "./comment.service";

type CommentsState = {
    postId: string | null
    comments: Comment[]
}

const initialState: CommentsState = {
    postId: null,
    comments: []
}

export const CommentsStore = signalStore(
  withState(initialState),
  withComputed((state) => ({
    count: computed(() => state.comments().length )
  })),
  withMethods((store, commentService = inject(CommentService)) => ({
    loadComments: rxMethod<string>(
      pipe(
        tap((postId) => patchState(store, { postId })),
        exhaustMap((postId) => commentService.getAll(postId)),
        tapResponse({
            next: ({ comments }) => patchState(store, { comments }),
            error: console.error,
        })
      )
    ),
    submit: rxMethod<Comment['note']>(
      pipe(
        filter((note) => !!note),
        concatMap((note) => {
          const postId = store.postId()
          return commentService.addComment(postId!, note)
        }),
        tapResponse({
          next: ({ comment }) => {
            patchState(store, (state) => ({
              comments: [comment, ...state.comments],
            }));
          },
          error: console.error,
        })
      )
    ),
    remove: rxMethod<Comment['_id']>(
      pipe(
        filter((commentId) => !!commentId),
        concatMap((commentId) => {
          const postId = store.postId()
          return commentService.removeComment(postId!, commentId)
        }),
        tapResponse({
          next: ({ removed }) => {
            patchState(store, (state) => ({
              comments: store.comments().filter((comment) => comment._id !== removed._id),
            }));
          },
          error: console.error,
        })
      )
    ),
  }))
);