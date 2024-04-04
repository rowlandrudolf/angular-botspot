import { Injectable, inject } from "@angular/core";

import { Profile } from "@app/shared/interfaces/profile.interface";
import { patchState, signalState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ProfileService } from "./profile.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { exhaustMap, pipe, switchMap } from "rxjs";
import { tapResponse } from "@ngrx/operators";


const initialState: Profile = {
    _id: null,
    username: '',
    followersCount: 0,
    followingCount: 0,
    following: false
}

export const ProfileStore = signalStore(
    withState(initialState),
    withMethods((store, profileService = inject(ProfileService)) => ({
        setProfile(profile: Profile){
            patchState(store, ({...profile}))
        },
        toggleFollow(){
            store.following()  
                ? this.unfollow()
                : this.follow()
        },
        follow: rxMethod<void>(
            pipe(
                switchMap(() => profileService.followUser(store.username()!)),
                tapResponse({
                    next: ({ followersCount, following }) => {
                        patchState(store, ({ followersCount, following }))
                    },
                    error: console.error
                })
            )
        ),
        unfollow: rxMethod<void>(
            pipe(
                switchMap(() => profileService.unfollowUser(store.username()!)),
                tapResponse({
                    next: ({ followersCount, following}) => {
                        patchState(store, ({ followersCount, following }))
                    },
                    error: console.error
                })
            )
        ),   
        })
    )
)