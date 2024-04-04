import { Routes } from '@angular/router';
import { profileResolver } from './profile/profile.resolver';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./shell/shell.component')
    },
    {
        path: 'profiles/:username',
        loadComponent: () => import('./profile/profile.component'),
        resolve: {
            profile: profileResolver
        }
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    }
];
