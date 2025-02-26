import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { map, take } from 'rxjs';

export const LoginGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const angularFireAuth = inject(AngularFireAuth);
  return angularFireAuth.authState.pipe(
    take(1),
    map((user) => {
      if (user) {
        return false;
      } else {
        return true;
      }
    })
  );
};
