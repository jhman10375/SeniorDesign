import { DraftSortOrderModel } from './draft-sort-order.model';
import { LeaguePlayerModel } from './league-player.model';

export class DraftOrderModel {
  Player: LeaguePlayerModel;
  SortOrder: DraftSortOrderModel;
  CurrentlyPicking: boolean;
}
