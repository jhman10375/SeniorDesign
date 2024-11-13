import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

import { DraftPickOrderTypeEnum } from '../../../../shared/enums/draft-pick-order-type.enum';
import { DraftOrderModel } from '../../../../shared/models/draft-order.model';
import { DraftSortOrderModel } from '../../../../shared/models/draft-sort-order.model';
import { LeagueModel } from '../../../../shared/models/league.model';

@Injectable()
export class DraftPickOrderService {
  currentPick: Observable<DraftOrderModel>;

  endDraft: Observable<boolean>;

  pickUpdated: Observable<boolean>;

  draftOrder: Observable<Array<DraftOrderModel>>;

  pickOrder: Observable<Array<DraftOrderModel>>;

  numberOfRounds: number = 10; // TODO: Update this to calculate by league settings based on number of players per team

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

  setPickOrder(league: LeagueModel): void {
    let pickOrder: Array<DraftOrderModel> = [];
    league.Players.forEach((player) => {
      const pickOrderModel: DraftOrderModel = new DraftOrderModel();
      pickOrderModel.Player = player;
      pickOrderModel.CurrentlyPicking = player.DraftPickSortOrder == 0;
      pickOrderModel.SortOrder = new DraftSortOrderModel();
      pickOrderModel.SortOrder.SortOrder = player.DraftPickSortOrder;
      pickOrderModel.SortOrder.Round = 0;
      pickOrder.push(pickOrderModel);
    });
    let pickOrderClone: Array<DraftOrderModel> = [];
    let shuffledIndices: Array<number> = [];
    switch (league.Settings.DraftPickOrderType) {
      case DraftPickOrderTypeEnum.AlphabeticalSequence:
        pickOrder.sort((a, b) => {
          return a.Player.Name.localeCompare(b.Player.Name, 'en', {
            sensitivity: 'base',
          });
        });
        for (let i = 0; i < pickOrder.length; i++) {
          pickOrder[i].SortOrder.SortOrder = i;
          pickOrder[i].Player.DraftPickSortOrder = i;
        }

        pickOrder.sort((a, b) => a.SortOrder.SortOrder - b.SortOrder.SortOrder);
        this._pickOrder.next(pickOrder);
        pickOrderClone = [];

        for (
          let currentRound = 0;
          currentRound < this.numberOfRounds;
          currentRound++
        ) {
          for (let i = 0; i < pickOrder.length; i++) {
            const selector: DraftOrderModel = new DraftOrderModel();
            selector.CurrentlyPicking = pickOrder[i].CurrentlyPicking;
            selector.Player = pickOrder[i].Player;
            selector.SortOrder = new DraftSortOrderModel();
            selector.SortOrder.SortOrder = i;
            selector.SortOrder.Round = currentRound;

            pickOrderClone.push(selector);
          }
        }
        break;
      case DraftPickOrderTypeEnum.AlphabeticalSnake:
        pickOrder.sort((a, b) => {
          return a.Player.Name.localeCompare(b.Player.Name, 'en', {
            sensitivity: 'base',
          });
        });
        for (let i = 0; i < pickOrder.length; i++) {
          pickOrder[i].SortOrder.SortOrder = i;
          pickOrder[i].Player.DraftPickSortOrder = i;
        }

        pickOrder.sort((a, b) => a.SortOrder.SortOrder - b.SortOrder.SortOrder);
        this._pickOrder.next(pickOrder);
        pickOrderClone = [];

        for (
          let currentRound = 0;
          currentRound < this.numberOfRounds;
          currentRound++
        ) {
          const isReverseOrder = currentRound % 2 === 0;

          if (isReverseOrder) {
            for (let i = 0; i < pickOrder.length; i++) {
              const selector: DraftOrderModel = new DraftOrderModel();
              selector.CurrentlyPicking = pickOrder[i].CurrentlyPicking;
              selector.Player = pickOrder[i].Player;
              selector.SortOrder = new DraftSortOrderModel();
              selector.SortOrder.SortOrder = i;
              selector.SortOrder.Round = currentRound;

              pickOrderClone.push(selector);
            }
          } else {
            for (let i = pickOrder.length - 1; i >= 0; i--) {
              const selector: DraftOrderModel = new DraftOrderModel();
              selector.CurrentlyPicking = pickOrder[i].CurrentlyPicking;
              selector.Player = pickOrder[i].Player;
              selector.SortOrder = new DraftSortOrderModel();
              selector.SortOrder.SortOrder = i;
              selector.SortOrder.Round = currentRound;

              pickOrderClone.push(selector);
            }
          }
        }
        break;
      case DraftPickOrderTypeEnum.RandomSequence:
        shuffledIndices = [...Array(pickOrder.length).keys()].sort(
          () => 0.5 - Math.random()
        );
        shuffledIndices.forEach((index, i) => {
          pickOrder[index].SortOrder.SortOrder = i;
        });

        pickOrder.sort((a, b) => a.SortOrder.SortOrder - b.SortOrder.SortOrder);
        this._pickOrder.next(pickOrder);
        pickOrderClone = [];

        for (
          let currentRound = 0;
          currentRound < this.numberOfRounds;
          currentRound++
        ) {
          for (let i = 0; i < pickOrder.length; i++) {
            const selector: DraftOrderModel = new DraftOrderModel();
            selector.CurrentlyPicking = pickOrder[i].CurrentlyPicking;
            selector.Player = pickOrder[i].Player;
            selector.SortOrder = new DraftSortOrderModel();
            selector.SortOrder.SortOrder = i;
            selector.SortOrder.Round = currentRound;

            pickOrderClone.push(selector);
          }
        }
        break;
      case DraftPickOrderTypeEnum.RandomSnake:
        shuffledIndices = [...Array(pickOrder.length).keys()].sort(
          () => 0.5 - Math.random()
        );
        shuffledIndices.forEach((index, i) => {
          pickOrder[index].SortOrder.SortOrder = i;
        });

        pickOrder.sort((a, b) => a.SortOrder.SortOrder - b.SortOrder.SortOrder);
        this._pickOrder.next(pickOrder);
        pickOrderClone = [];

        for (
          let currentRound = 0;
          currentRound < this.numberOfRounds;
          currentRound++
        ) {
          const isReverseOrder = currentRound % 2 === 1;

          if (isReverseOrder) {
            for (let i = 0; i < pickOrder.length; i++) {
              const selector: DraftOrderModel = new DraftOrderModel();
              selector.CurrentlyPicking = pickOrder[i].CurrentlyPicking;
              selector.Player = pickOrder[i].Player;
              selector.SortOrder = new DraftSortOrderModel();
              selector.SortOrder.SortOrder = i;
              selector.SortOrder.Round = currentRound;

              pickOrderClone.push(selector);
            }
          } else {
            for (let i = pickOrder.length - 1; i >= 0; i--) {
              const selector: DraftOrderModel = new DraftOrderModel();
              selector.CurrentlyPicking = pickOrder[i].CurrentlyPicking;
              selector.Player = pickOrder[i].Player;
              selector.SortOrder = new DraftSortOrderModel();
              selector.SortOrder.SortOrder = i;
              selector.SortOrder.Round = currentRound;

              pickOrderClone.push(selector);
            }
          }
        }
        break;
    }
    pickOrderClone[0].CurrentlyPicking = true;
    this._currentPick.next(pickOrderClone[0]);
    this._draftOrder.next(pickOrderClone);
    this._pickUpdated.next(true);
  }

  updateCurrentPick(): void {
    const pickOrder: Array<DraftOrderModel> = this._draftOrder.value;
    const pickOrderUpdated: Array<DraftOrderModel> = [];

    for (let i = 1; i < pickOrder.length; i++) {
      pickOrderUpdated.push(pickOrder[i]);
    }

    if (pickOrderUpdated.length == 0) {
      this._endDraft.next(true);
    } else {
      pickOrderUpdated[0].CurrentlyPicking = true;
    }

    const pick = cloneDeep(pickOrderUpdated[0]);

    this._currentPick.next(pick);
    this._draftOrder.next(pickOrderUpdated);
    this._pickUpdated.next(true);
  }
}
