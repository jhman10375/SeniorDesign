import { BasketballPositionEnum } from '../../enums/position/basketball-position.enum';

export class BasketballPlayerStatsModel {
  PlayerName: string;
  PlayerID: string;
  PlayerPosition: BasketballPositionEnum;
  ThreePointers: number;
  TwoPointers: number;
  FreeThrows: number;
  Rebounds: number;
  Assists: number;
  BlockedShots: number;
  Steals: number;
  Turnovers: number;

  constructor() {
    this.PlayerName = '';
    this.PlayerID = '';
    this.PlayerPosition = BasketballPositionEnum.None;
    this.ThreePointers = 0;
    this.TwoPointers = 0;
    this.FreeThrows = 0;
    this.Rebounds = 0;
    this.Assists = 0;
    this.BlockedShots = 0;
    this.Steals = 0;
    this.Turnovers = 0;
  }
}
