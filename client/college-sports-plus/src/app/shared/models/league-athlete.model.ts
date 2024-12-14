import { SchoolModel } from './school.model';

export class LeagueAthleteModel {
  AthleteID: string;
  PlayerID: string;
  Name: string;
  Number: string | Number;
  School: SchoolModel;

  constructor() {
    this.AthleteID = '';
    this.PlayerID = '';
    this.Name = '';
    this.Number = '-1';
    this.School = new SchoolModel();
  }
}
