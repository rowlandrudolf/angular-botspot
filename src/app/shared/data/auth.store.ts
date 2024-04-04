import { Injectable, inject } from "@angular/core";
import { patchState, signalState } from "@ngrx/signals";
import { StorageService } from "./storage.service";
import { Router } from "@angular/router";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, switchMap, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { tapResponse } from "@ngrx/operators";
import { AuthUser, CredentialsType } from "../interfaces/user.interface";

import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

type AuthState = { 
    user: AuthUser | null, 
    error: null | string,
    loading: boolean
};

const initialState: AuthState = {
  user: null,
  error: null,
  loading: false
};

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  readonly state = signalState(initialState);
  readonly user = this.state.user;
  readonly error = this.state.error;

  constructor(){
    if(!this.storageService.get('accessToken')) return
    
    this.authService.getCurrentUser().pipe(takeUntilDestroyed())
        .subscribe({
            next: ({user}) => {
                this.storageService.set('accessToken', user.token)
                patchState(this.state, { user })
            },
            error: (e) => patchState(this.state, { user: null })
        })
  }


  readonly login = rxMethod<CredentialsType>(
    pipe(
        tap(() => patchState(this.state, { loading: true })),
        exhaustMap((credentials) => {
            return this.authService.login(credentials).pipe(
                tapResponse({
                    next: ({user}) => {
                        this.storageService.set('accessToken', user.token)
                        patchState(this.state, { user, loading: false })
                    },
                    error: (error: string) => 
                        patchState(this.state, { user: null, error, loading: false })
                })
            )
        })
    )
  )

  readonly register = rxMethod<CredentialsType>(
    pipe(
        tap(() => patchState(this.state, { loading: true })),
        exhaustMap((credentials) => {
            return this.authService.register(credentials).pipe(
                tapResponse({
                    next: ({user}) => {
                        this.storageService.set('accessToken', user.token)
                        patchState(this.state, { user, loading: false })
                    },
                    error: (error: string) => 
                        patchState(this.state, { user: null, error, loading: false })
                })
            )
        })
    )
  )


  logout(){
    this.storageService.remove('accessToken')
    this.storageService.remove('currentPath')
    patchState(this.state, { user: null })
    this.router.navigateByUrl('auth/login')
  }

//   init() {
//     if (!this.storageService.get('accessToken')) return;
//     this.getCurrentUser()
//       .pipe(takeUntilDestroyed())
//       .subscribe({
//         next: ({ user }) => {
//           this.storageService.set('accessToken', user.token);
//           this.user$.next(user);
//         },
//         error: () => this.user$.next(null),
//       });
//   }

//   getCurrentUser(): Observable<AuthResponseInterface> {
//     return this.http.get<AuthResponseInterface>(this.authUrl + '/user');
//   }

//   usernameAvailable(username: string): Observable<{ available: boolean }> {
//     return this.http.get<{ available: boolean }>(
//       `http://localhost:3000/user/available?username=${username}`
//     ); // !!!!!!
//   }

//   register(credentials: Credentials) {
//     return this.http
//       .post<AuthResponseInterface>(this.authUrl + '/register', {
//         user: credentials,
//       })
//       .pipe(
//         tap((res) => {
//           const { user } = res;
//           this.storageService.set('accessToken', user.token);
//           this.user$.next(user);
//         }),
//         catchError(this.handleError)
//       );
//   }

//   login(credentials: Credentials) {

//   }

//   logout() {
  
//   }

//   private handleError(err: HttpErrorResponse): Observable<never> {
//     let response: string[] = [];
//     if (err.error.message instanceof Array) {
//       response = err.error.message;
//     } else {
//       response = [err.error.message];
//     }
//     return throwError(() => response);
//   }
}
