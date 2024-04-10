import { inject } from "@angular/core";
import { Post } from "@app/shared/interfaces"
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { concatMap, exhaustMap, pipe, switchMap, tap } from "rxjs";
import { PostService } from "./post.service";

type FilterType = {
    skip: number;
    path: string;
}

type PostsState = {
    posts: Post[];
    count: number;
    loading: boolean,
    error: string | null;
    filter: FilterType
}

const initialState: PostsState = {
    posts: [],
    count: 0,
    loading: false,
    error: null,
    filter: {
        path: '',
        skip: 0
    }
}

export const PostsStore = signalStore(
    withState(initialState),
    withMethods((store, postService = inject(PostService)) => ({
        setPath(path: string): void {
            patchState(store, (state) => ({ ...state, filter: { path, skip: 0 }}))
        },
        setSkip(skip: number): void {
            patchState(store, (state) => ({ ...state, filter: { ...state.filter, skip }}))
        },
        loadPosts: rxMethod<FilterType>(
            pipe(
                tap(() => patchState(store, { posts: [], loading: true })),
                exhaustMap(({path, skip}) => {
                    return postService.getAll(path, skip).pipe(
                        tapResponse({
                            next: ({posts, count}) => patchState(store, { posts, count, loading: false }),
                            error: (err) => console.error(err)
                        })
                    )
                })
            ),
        ),
        submitPost: rxMethod<Post['body']>(
            pipe(
                concatMap((body) => {
                    return postService.create(body).pipe(
                        tapResponse({
                            next: (res) => {
                               patchState(store, (state) => ({
                                    posts: [res.post, ...state.posts],
                                    count: ++state.count
                               }))
                            },
                            error: console.error
                        })
                    )
                })
            )
        ),
        removePost: rxMethod<Post['_id']>(
            pipe(
                concatMap((postId) => {
                    return postService.remove(postId).pipe(
                        tapResponse({
                            next: ({removed}) => {
                               patchState(store, (state) => ({
                                    posts: state.posts.filter((post) => post._id !== removed._id),
                                    count: --state.count
                               }))
                            },
                            error: console.error
                        })
                    )
                })
            )
        )
    }))
)