import { Injectable, OnDestroy } from '@angular/core';
import {
  AngularFirestore,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
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

  getNewID(): string {
    return this.firestore.createId();
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

  addWithNestedOBJ(
    item: TDataType,
    collection: CollectionsEnum,
    needsID: boolean = true
  ) {
    item = item as any;
    if (needsID) {
      item.ID = this.firestore.createId();
    }
    let newItem = Object.assign({}, item);
    this.firestore
      .collection(CollectionsEnum[collection])
      .doc(item.ID)
      .set(JSON.parse(JSON.stringify(newItem)));
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

  updateNestedOBJ(item: TDataType, collection: CollectionsEnum): Promise<void> {
    let newItem = Object.assign({}, item);
    return this.firestore
      .collection(CollectionsEnum[collection])
      .doc(item.ID)
      .update(JSON.parse(JSON.stringify(newItem)));
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

  getDoc(collectionRef: string): Observable<any> {
    return this.firestore.doc(collectionRef).valueChanges();
  }

  queryGroupSingleWhereConditionNoLimit(
    collection: CollectionsEnum,
    property: string,
    operator:
      | '<'
      | '<='
      | '=='
      | '>'
      | '>='
      | '!='
      | 'array-contains'
      | 'array-contains-any'
      | 'in'
      | 'not-in',
    query: any
  ): Promise<QuerySnapshot<any>> {
    return this.firestore
      .collection<any>(CollectionsEnum[collection])
      .ref.where(property, operator, query)
      .get();
  }
}
