import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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
  }
  initialize(): void {}

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
}
