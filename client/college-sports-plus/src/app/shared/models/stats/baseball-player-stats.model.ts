import { BaseballPositionEnum } from '../../enums/position/baseball-position.enum';

export class BaseballPlayerStatsModel {
  PlayerName: string;
  PlayerID: string;
  PlayerPosition: BaseballPositionEnum;
  Win: boolean;
  Saves: number;
  Innings: number;
  EarnedRunsAllowed: number;
  Singles: number;
  Doubles: number;
  Triples: number;
  Homers: number;
  Runs: number;
  RunsBattedIn: number;
  Walks: number;
  HitsByPitch: number;
  StolenBases: number;
  CaughtStealing: number;

  constructor() {
    this.PlayerName = '';
    this.PlayerID = '';
    this.PlayerPosition = BaseballPositionEnum.None;
    this.Win = false;
    this.Saves = 0;
    this.Innings = 0;
    this.EarnedRunsAllowed = 0;
    this.Singles = 0;
    this.Doubles = 0;
    this.Triples = 0;
    this.Homers = 0;
    this.Runs = 0;
    this.RunsBattedIn = 0;
    this.Walks = 0;
    this.HitsByPitch = 0;
    this.StolenBases = 0;
    this.CaughtStealing = 0;
  }
}
