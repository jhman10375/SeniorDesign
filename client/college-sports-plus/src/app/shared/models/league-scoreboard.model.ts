import { SportEnum } from '../enums/sport.enum';
import { SchoolModel } from './school.model';

export class LeagueScorboardModel {
  CurrentRanking: number;
  ID: string;
  Leader: string;
  Manager: string;
  Name: string;
  SchoolColors: SchoolModel;
  Sport: SportEnum;
  Team: string;

  constructor() {
    this.CurrentRanking = 0;
    this.ID = '';
    this.Leader = '';
    this.Manager = '';
    this.Name = '';
    this.SchoolColors = new SchoolModel();
    this.Sport = SportEnum.None;
    this.Team = '';
  }
}
