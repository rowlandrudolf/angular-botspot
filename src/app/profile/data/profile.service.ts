import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { Profile } from "@app/shared/interfaces";

import { Observable, catchError, map, throwError } from "rxjs";
import { environment } from "../../../environments/environment";



export interface ProfileResponseInterface {
    profile: Profile
}

interface ProfileStateInterface {
    profile: Profile | null,
    pending: boolean,
    error: null | string
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private http = inject(HttpClient)
    profileUrl = `${environment.baseApiUrl}/profiles`
           

    getProfile(username: string): Observable<Profile>{
        return this.http.get<ProfileResponseInterface>(`${this.profileUrl}/${username}`)
          .pipe(
            map(res => res.profile),
            catchError(this.handleError)
        )
    }

    toggleFollow(follow: boolean, username: string): Observable<Profile>{
        return follow 
            ? this.followUser(username)
            : this.unfollowUser(username)
    }
    
    private followUser(username: string): Observable<Profile>{
        return this.http.post<ProfileResponseInterface>(`${this.profileUrl}/${username}/follow`, {})
          .pipe(
            map(res => res.profile),
            catchError(this.handleError)
         )
    }

    private unfollowUser(username: string): Observable<Profile>{
        return this.http.delete<{removed: Profile}>(`${this.profileUrl}/${username}/follow`, {})
          .pipe(
            map(res => res.removed),
            catchError(this.handleError))
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        let msg: string[] = [];
        if(err.error.message instanceof Array){
            msg = err.error.message
        }else {
            msg = [err.error.message]
        }
        return throwError(() => msg);
      }
}
