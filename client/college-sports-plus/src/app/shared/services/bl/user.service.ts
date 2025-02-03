import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { CurrentUserModel } from '../../models/current-user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  CurrentUser: Observable<CurrentUserModel>;

  private _CurrentUser = new BehaviorSubject<CurrentUserModel>({
    Name: 'Jordan Herman',
    ID: '0',
  });

  constructor() {
    this.CurrentUser = this._CurrentUser.asObservable();
  }

  setCurrentUser(user: CurrentUserModel): void {
    this._CurrentUser.next(user);
  }
}
