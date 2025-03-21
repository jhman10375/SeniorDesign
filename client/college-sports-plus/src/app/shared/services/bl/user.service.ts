import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { CurrentUserModel } from '../../models/current-user.model';
import { UserDLService } from '../dl/user.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  CurrentUser: Observable<CurrentUserModel>;

  // private _CurrentUser = new BehaviorSubject<CurrentUserModel>({
  //   Name: 'Jordan Herman',
  //   ID: '9vnblV3TFHb7XNisPvkX2tTTkhj2',
  //   LeagueIDs: ['0'],
  // });
  private _CurrentUser = new BehaviorSubject<CurrentUserModel>({
    Name: '',
    ID: '',
    LeagueIDs: [],
  });

  private unsubscribe = new Subject<void>();

  constructor(private userDlService: UserDLService) {
    this.CurrentUser = this._CurrentUser.asObservable();
    // need to setup a check right here to pull user from firebase
    const userID: string = localStorage.getItem('uid') ?? '';
    if (userID) {
      this.getCurrentUserData(userID);
    }

    this.userDlService.initialize();
  }

  getCurrentUserData(userID: string): void {
    if (this._CurrentUser.value.ID != userID) {
      // console.log(userID);
      this.userDlService
        .getUser(userID)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next: (user) => {
            // console.log(user);
            this.setCurrentUser(user);
          },
        });
    }
  }

  setCurrentUser(user: CurrentUserModel): void {
    this._CurrentUser.next(user);
  }

  getCurrentUser(): CurrentUserModel {
    return this._CurrentUser.value;
  }

  createUser(user: CurrentUserModel): void {
    this.userDlService.addEntity(user);
    this.setCurrentUser(user);
  }

  updateCurrentUser(user: CurrentUserModel): void {
    this.userDlService.updateEntity(user);
    this.setCurrentUser(user);
  }
}
