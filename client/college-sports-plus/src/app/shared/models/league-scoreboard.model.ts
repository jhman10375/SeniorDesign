import { SportEnum } from '../enums/sport.enum';

export class LeagueScorboardModel {
  CurrentRanking: number;
  ID: string;
  Leader: string;
  Manager: string;
  Name: string;
  Sport: SportEnum;
  Team: string;

  constructor() {
    this.CurrentRanking = 0;
    this.ID = '';
    this.Leader = '';
    this.Manager = '';
    this.Name = '';
    this.Sport = SportEnum.None;
    this.Team = '';
  }
}
