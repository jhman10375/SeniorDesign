import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { DraftOrderModel } from '../../../../../shared/models/draft-order.model';

@Injectable()
export class DraftPickOrderService {
  currentPick: Observable<DraftOrderModel>;

  endDraft: Observable<boolean>;

  pickUpdated: Observable<boolean>;

  draftOrder: Observable<Array<DraftOrderModel>>;

  pickOrder: Observable<Array<DraftOrderModel>>;

  private _currentPick = new BehaviorSubject<DraftOrderModel>(
    new DraftOrderModel()
  );

  private _draftOrder = new BehaviorSubject<Array<DraftOrderModel>>([]);

  private _pickOrder = new BehaviorSubject<Array<DraftOrderModel>>([]);

  private _endDraft = new BehaviorSubject<boolean>(false);

  private _pickUpdated = new BehaviorSubject<boolean>(false);

  constructor() {
    this.currentPick = this._currentPick.asObservable();
    this.draftOrder = this._draftOrder.asObservable();
    this.pickOrder = this._pickOrder.asObservable();
    this.endDraft = this._endDraft.asObservable();
    this.pickUpdated = this._pickUpdated.asObservable();
  }

  stopDraft(): void {
    this._endDraft.next(true);
    localStorage.removeItem('bkbdk');
  }

  setPickOrder(pickOrder: Array<DraftOrderModel>): void {
    const x = pickOrder.filter(
      (obj, index, self) =>
        index === self.findIndex((o) => o.Player.ID === obj.Player.ID)
    );
    const y = x.sort(
      (a, b) => a.Player.DraftPickSortOrder - b.Player.DraftPickSortOrder
    );
    this._pickOrder.next(y);
  }

  createDraftOrder(draftOrder: Array<DraftOrderModel>): void {
    draftOrder[0].CurrentlyPicking = true;
    this._currentPick.next(draftOrder[0]);
    this._draftOrder.next(draftOrder);
    this._pickUpdated.next(true);
  }

  isFinalPick(): boolean {
    if (this._draftOrder.value.length > 1) {
      return false;
    } else {
      return true;
    }
  }
}
