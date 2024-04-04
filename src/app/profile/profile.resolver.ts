import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ProfileResponseInterface, ProfileService } from './data/profile.service';
import { EMPTY, catchError, delay, map } from 'rxjs';
import { Profile } from '@app/shared/interfaces';

export const profileResolver: ResolveFn<Profile> = (route, state) => {
  const router = inject(Router);
  return inject(ProfileService).getProfile(route.paramMap.get('username')!).pipe(
    catchError(() => {
      router.navigate([""])
      return EMPTY
    })
  )
};
