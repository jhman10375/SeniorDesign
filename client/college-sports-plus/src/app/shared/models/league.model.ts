import { SportEnum } from '../enums/sport.enum';
import { HasID } from '../services/firebase/interfaces/has-id.interface';
import { BaseballLeagueSettingsModel } from './baseball-league-settings/baseball-league-settings.model';
import { BasketballLeagueSettingsModel } from './basketball-league-settings/basketball-league-settings.model';
import { FootballLeagueSettingsModel } from './football-league-settings/football-league-settings.model';
import { LeagueAthleteModel } from './league-athlete.model';
import { LeaguePlayerModel } from './league-player.model';
import { LeagueWeekModel } from './league-week.model';
import { SoccerLeagueSettingsModel } from './soccer-league-settings/soccer-league-settings.model';

export class LeagueModel implements HasID {
  ID: string;
  Manager: LeaguePlayerModel;
  Name: string;
  DraftDate: Date;
  DraftComplete: boolean;
  Settings:
    | FootballLeagueSettingsModel
    | SoccerLeagueSettingsModel
    | BaseballLeagueSettingsModel
    | BasketballLeagueSettingsModel;
  Players: Array<LeaguePlayerModel>;
  Athletes: Array<LeagueAthleteModel>;
  LeagueType: SportEnum;
  Season: Array<LeagueWeekModel>;
}
