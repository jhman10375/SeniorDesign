import { FootballPositionEnum } from '../../enums/position/football-position.enum';

export class FootballPlayerStatsModel {
  PlayerName: string;
  PlayerID: string;
  PlayerPosition: FootballPositionEnum;
  PassTD: number;
  PassYds: number;
  Interceptions: number;
  FumblesLost: number;
  RushYds: number;
  RushTD: number;
  ReceptionYds: number;
  ReceptionTD: number;
  Receptions: number;
  ExtraPoints: number;
  ExtraPointsMissed: number;
  FieldGoals: number;
  FieldGoalsMissed: number;

  constructor() {
    this.PlayerName = '';
    this.PlayerID = '';
    this.PlayerPosition = FootballPositionEnum.None;
    this.PassTD = 0;
    this.PassYds = 0;
    this.Interceptions = 0;
    this.FumblesLost = 0;
    this.RushYds = 0;
    this.RushTD = 0;
    this.ReceptionYds = 0;
    this.ReceptionTD = 0;
    this.Receptions = 0;
    this.ExtraPoints = 0;
    this.ExtraPointsMissed = 0;
    this.FieldGoals = 0;
    this.FieldGoalsMissed = 0;
  }
}
