import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { CurrentUserModel } from '../../../shared/models/current-user.model';
import { LoadingService } from '../../../shared/services/bl/loading.service';
import { UserService } from '../../../shared/services/bl/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: Observable<any | null>;
  private _currentUser = new BehaviorSubject<any | null>(null);

  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private loadingService: LoadingService,
    private currentUserService: UserService
  ) {
    this.currentUser = this._currentUser.asObservable();
  }

  checkAuthentication(): Promise<any | null> {
    return this.angularFireAuth.currentUser;
  }

  login(username: string, password: string): void {
    this.angularFireAuth
      .signInWithEmailAndPassword(username, password)
      .then((result) => {
        if (result && result.user) {
          localStorage.setItem(
            'lt',
            // (new Date().getTime() + 30000).toString() //set timeout time for auth systems 30 seconds (devmode)
            (new Date().getTime() + 3600000).toString() //set timeout time for auth systems 1 hour (production)
          );

          localStorage.setItem('uid', result.user.uid);
          console.log((result as any)?.user?._delegate?.stsToken);
          result.user?.getIdToken().then((x) => {
            console.log(x);
          });
          this.currentUserService.getCurrentUserData(result.user.uid);
          this._currentUser.next(result);
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      })
      .catch((e) => console.error(e));
  }

  register(name: string, username: string, password: string): void {
    this.angularFireAuth
      .createUserWithEmailAndPassword(username, password)
      .then((result) => {
        this.loadingService.setIsLoading(true);
        if (result && result.user) {
          result.user
            .updateProfile({
              displayName: name,
            })
            .then((v) => {
              if (result && result.user) {
                localStorage.setItem(
                  'lt',
                  // (new Date().getTime() + 30000).toString() //set timeout time for auth systems 30 seconds (devmode)
                  (new Date().getTime() + 3600000).toString() //set timeout time for auth systems 1 hour (production)
                );
                localStorage.setItem('uid', result.user?.uid ?? '');
                this.loadingService.setIsLoading(false);
                this.currentUserService.createUser({
                  Name: result.user.displayName ?? '',
                  ID: result.user.uid,
                  LeagueIDs: [],
                });

                this.router.navigate(['/home']);
              } else {
                this.router.navigate(['/login']);
              }
            });
        } else {
          this.router.navigate(['/login']);
        }
      })
      .catch((e) => console.error(e));
  }

  updateUser(user: CurrentUserModel): void {
    this.angularFireAuth.currentUser
      .then((result) => {
        if (result) {
          result
            .updateProfile({ displayName: user.Name })
            .then((u) => {
              this.currentUserService.updateCurrentUser(user);
            })
            .catch((e) => console.error(e));
        }
      })
      .catch((e) => console.error(e));
  }

  logout(): void {
    this.angularFireAuth.signOut().then((t) => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}
