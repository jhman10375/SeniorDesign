import { Location } from '@angular/common';
import { Injectable, isDevMode, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { Subject, take } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SessionCheckStatusService implements OnDestroy {
  private readonly loginRoutes: Array<string> = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];

  private unsubscribe = new Subject<void>();

  constructor(
    private angularFireAuth: AngularFireAuth,
    private authService: AuthService,
    private activatedRouteSnapshot: ActivatedRoute,
    private location: Location
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  checkSessionStatus(): void {
    this.angularFireAuth.authState.pipe(take(1)).subscribe({
      next: (value) => {
        //   console.log(value);
        const lt = localStorage.getItem('lt');
        const uid = localStorage.getItem('uid');
        const loginPage = this.loginRoutes.includes(this.location.path());

        if (
          (lt && parseInt(lt) > new Date().getTime() && value?.uid == uid) ||
          loginPage
        ) {
          // if (value && lt && parseInt(lt) > new Date().getTime()) {
          if (isDevMode()) console.log('stay logged in');
        } else {
          if (isDevMode()) console.log('log out');
          this.authService.logout();
        }
      },
    });
  }
}
