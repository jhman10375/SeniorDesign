import { SoccerPositionEnum } from '../../enums/position/soccer-position.enum';

export class SoccerPlayerStatsModel {
  PlayerName: string;
  PlayerID: string;
  PlayerPosition: SoccerPositionEnum;
  Goals: number;
  Assists: number;
  ShotsOnGoal: number;
  ShotsOffGoal: number;
  Fouls: number;
  YellowCards: number;
  RedCards: number;
  CleanSheet: number;
  GoalsAllowed: number;
  Saves: number;

  constructor() {
    this.PlayerName = '';
    this.PlayerID = '';
    this.PlayerPosition = SoccerPositionEnum.None;
    this.Goals = 0;
    this.Assists = 0;
    this.ShotsOnGoal = 0;
    this.ShotsOffGoal = 0;
    this.Fouls = 0;
    this.YellowCards = 0;
    this.RedCards = 0;
    this.CleanSheet = 0;
    this.GoalsAllowed = 0;
    this.Saves = 0;
  }
}
