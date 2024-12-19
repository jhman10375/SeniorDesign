import { SportEnum } from '../enums/sport.enum';
import { BaseballLeagueSettingsModel } from './baseball-league-settings/baseball-league-settings.model';
import { BasketballLeagueSettingsModel } from './basketball-league-settings/basketball-league-settings.model';
import { FootballLeagueSettingsModel } from './football-league-settings/football-league-settings.model';
import { LeagueAthleteModel } from './league-athlete.model';
import { LeaguePlayerModel } from './league-player.model';
import { SoccerLeagueSettingsModel } from './soccer-league-settings/soccer-league-settings.model';

export class LeagueModel {
  ID: string;
  Manager: LeaguePlayerModel;
  Name: string;
  DraftDate: Date;
  Settings:
    | FootballLeagueSettingsModel
    | SoccerLeagueSettingsModel
    | BaseballLeagueSettingsModel
    | BasketballLeagueSettingsModel;
  Players: Array<LeaguePlayerModel>;
  Athletes: Array<LeagueAthleteModel>;
  LeagueType: SportEnum;
}
