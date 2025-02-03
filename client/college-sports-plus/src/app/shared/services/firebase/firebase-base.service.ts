import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';

import { CollectionsEnum } from './enums/collections.enum';
import { HasID } from './interfaces/has-id.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class FirebaseService<TDataType extends HasID>
  implements OnDestroy
{
  _unsubscribe = new Subject<void>();

  constructor(private firestore: AngularFirestore) {}

  ngOnDestroy(): void {
    this._unsubscribe.next();
  }

  add(item: TDataType, collection: CollectionsEnum, needsID: boolean = true) {
    item = item as any;
    if (needsID) {
      item.ID = this.firestore.createId();
    }
    let newItem = Object.assign({}, item);
    this.firestore
      .collection(CollectionsEnum[collection])
      .doc(item.ID)
      .set(newItem);
  }

  delete(item: TDataType, collection: CollectionsEnum) {
    this.firestore
      .collection(CollectionsEnum[collection])
      .doc(item.ID)
      .delete();
  }

  update(item: TDataType, collection: CollectionsEnum) {
    let newItem = Object.assign({}, item);
    this.firestore
      .collection(CollectionsEnum[collection])
      .doc(item.ID)
      .update(newItem);
  }

  updateByID(item: TDataType, collection: CollectionsEnum) {
    let newItem = Object.assign({}, item);
    return this.firestore
      .collection(CollectionsEnum[collection])
      .doc(item.ID)
      .set(newItem);
  }

  get(collection: CollectionsEnum): Observable<Array<TDataType>> {
    return this.firestore
      .collection(CollectionsEnum[collection])
      .valueChanges() as Observable<Array<TDataType>>;
  }
}
