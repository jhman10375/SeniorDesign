import { Injectable } from '@angular/core';

import { UserModel } from './models/user.model';

@Injectable()
export class UserService {
  currentUser: UserModel | undefined = undefined;
  constructor() {
    this.getUser();
  }

  getUser(): UserModel | undefined {
    const user: UserModel | undefined = new UserModel();
    user.ID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';
    user.FirstName = 'Jordan';
    user.LastName = 'Herman';
    user.LeagueIDs = ['0'];
    this.currentUser = user;
    return user;
  }
}
