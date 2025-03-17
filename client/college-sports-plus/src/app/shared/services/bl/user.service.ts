import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { CurrentUserModel } from '../../models/current-user.model';

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
  constructor() {
    this.CurrentUser = this._CurrentUser.asObservable();
    // need to setup a check right here to pull user from firebase
    const userID: string = localStorage.getItem('uid') ?? '';
    if (userID) {
      this.setCurrentUser({
        Name: '',
        ID: userID,
        LeagueIDs: [],
      });
    }
  }

  setCurrentUser(user: CurrentUserModel): void {
    this._CurrentUser.next(user);
  }

  getCurrentUser(): CurrentUserModel {
    return this._CurrentUser.value;
  }
}
