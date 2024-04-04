import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '@app/shared/data/auth.service';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  timer,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsernameAvailableValidator implements AsyncValidator {
  private authService = inject(AuthService);

  validate(
    ctrl: AbstractControl<any, any>,
  ): Observable<ValidationErrors | null> {
    return timer(600).pipe(
      switchMap(() =>
        this.authService.usernameAvailable(ctrl.value).pipe(
          tap((data) => console.log(data)),
          map((res: any) =>
            res.available ? null : { usernameAvailableError: true },
          ),
          catchError(() => of({ usernameAvailableError: true })),
        ),
      ),
    );
  }
}
