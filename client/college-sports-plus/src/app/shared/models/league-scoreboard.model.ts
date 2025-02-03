import { SportEnum } from '../enums/sport.enum';
import { HasID } from '../services/firebase/interfaces/has-id.interface';

export class LeagueScorboardModel implements HasID {
  CurrentRanking: number;
  ID: string;
  Leader: string;
  Manager: string;
  Name: string;
  // SchoolColors: SchoolModel;
  PrimaryColor: string;
  SecondaryColor: string;
  Sport: SportEnum;
  Team: string;

  constructor() {
    this.CurrentRanking = 0;
    this.ID = '';
    this.Leader = '';
    this.Manager = '';
    this.Name = '';
    this.PrimaryColor = '';
    this.SecondaryColor = '';
    // this.SchoolColors = new SchoolModel();
    this.Sport = SportEnum.None;
    this.Team = '';
  }
}
