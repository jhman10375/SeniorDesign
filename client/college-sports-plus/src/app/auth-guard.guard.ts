import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map, take } from 'rxjs';

import { AuthService } from './pages/login/services/auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const angularFireAuth = inject(AngularFireAuth);
  const authService = inject(AuthService);
  const lt = localStorage.getItem('lt');
  return angularFireAuth.authState.pipe(
    take(1),
    map((user) => {
      if (user && lt && parseInt(lt) > new Date().getTime()) {
        return true;
      } else {
        authService.logout();
        return false;
      }
    })
  );
};
