import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, takeUntil } from 'rxjs';

import { CurrentUserModel } from '../../models/current-user.model';
import { CollectionsEnum } from '../firebase/enums/collections.enum';
import { FirebaseService } from '../firebase/firebase-base.service';
import { FirebaseCrud } from '../firebase/interfaces/firebase-crud.interface';

@Injectable({ providedIn: 'root' })
export class UserDLService
  extends FirebaseService<CurrentUserModel>
  implements FirebaseCrud<CurrentUserModel>
{
  // currentUser: UserModel | undefined = undefined;

  constructor(firestore: AngularFirestore) {
    super(firestore);
    this.initialize();
    // this.getUser();
    // this.getUser('9vnblV3TFHb7XNisPvkX2tTTkhj2');
  }
  initialize(): void {
    this.get(CollectionsEnum.Users)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe({
        next: (collection) => {
          console.log(collection);
        },
      });
  }

  addEntity(model: CurrentUserModel): void {
    this.add(model, CollectionsEnum.Users, false);
  }

  addEntityNeedsID(model: CurrentUserModel): void {
    this.add(model, CollectionsEnum.Users, true);
  }

  deleteEntity(model: CurrentUserModel): void {
    this.delete(model, CollectionsEnum.Users);
  }

  updateEntity(model: CurrentUserModel): void {
    this.update(model, CollectionsEnum.Users);
  }

  getUser(userID: string): Observable<CurrentUserModel> {
    return this.getDoc(`Users/${userID}`);
  }

  // getUser(): UserModel | undefined {
  //   const user: UserModel | undefined = new UserModel();
  //   user.ID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';
  //   user.FirstName = 'Jordan';
  //   user.LastName = 'Herman';
  //   user.LeagueIDs = ['0'];
  //   this.currentUser = user;
  //   return user;
  // }
}
