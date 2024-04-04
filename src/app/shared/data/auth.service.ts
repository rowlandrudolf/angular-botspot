import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { signalState } from '@ngrx/signals';
import { AuthUser, CredentialsType } from '../interfaces/user.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthResponseInterface {
    user: AuthUser
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseApiUrl = environment.baseApiUrl
  private authUrl = `${this.baseApiUrl}/auth`
  private http = inject(HttpClient);


  register(credentials: CredentialsType) {
    return this.http.post<AuthResponseInterface>(this.authUrl + '/register', { user: credentials })
        .pipe(catchError(this.handleError))
  }

  login(credentials: CredentialsType): Observable<AuthResponseInterface> {
    return this.http.post<AuthResponseInterface>(this.authUrl + '/login', { user: credentials })
        .pipe(catchError(this.handleError))
  }

  getCurrentUser(): Observable<AuthResponseInterface> {
    return this.http.get<AuthResponseInterface>(this.authUrl + '/user');
  }

  usernameAvailable(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.baseApiUrl}/user/available?username=${username}`); // !!!!!!
  }

  logout() {
    // this.storageService.remove('accessToken');
    // this.storageService.remove('currentPath');
    // this.user$.next(null);
    // this.router.navigateByUrl('auth/login');
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let response: string[] = [];
    if(err.error.message instanceof Array){
      response = err.error.message
    }else {
      response = [err.error.message]
    }
    return throwError(() => response);
  }
}
