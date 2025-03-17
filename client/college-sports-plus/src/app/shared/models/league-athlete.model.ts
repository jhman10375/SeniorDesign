import { BaseballPositionEnum } from '../enums/position/baseball-position.enum';
import { BasketballPositionEnum } from '../enums/position/basketball-position.enum';
import { FootballPositionEnum } from '../enums/position/football-position.enum';
import { SoccerRosterModel } from './roster/soccer-roster.model';

export class LeagueAthleteModel {
  AthleteID: string;
  AltColor: string;
  Color: string;
  Height: number;
  Jersey: number;
  Logos: Array<string>;
  Name: string;
  PlayerID: string | null;
  Position:
    | FootballPositionEnum
    | BaseballPositionEnum
    | BasketballPositionEnum
    | SoccerRosterModel;
  PredictedScore: number;
  School: string;
  Team: string;
  Weight: number;
  Year: number;

  constructor() {
    this.AthleteID = '';
    this.AltColor = '';
    this.Color = '';
    this.Height = 0;
    this.Jersey = 0;
    this.Logos = [];
    this.Name = '';
    this.PlayerID = null;
    this.Position = 0;
    this.PredictedScore = 0;
    this.School = '';
    this.Team = '';
    this.Weight = 0;
    this.Year = 0;
  }
}
