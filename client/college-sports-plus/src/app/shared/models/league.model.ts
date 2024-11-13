import { SportEnum } from '../enums/sport.enum';
import { LeagueAthleteModel } from './league-athlete.model';
import { LeaguePlayerModel } from './league-player.model';
import { LeagueSettingsModel } from './league-settings.model';

export class LeagueModel {
  ID: string;
  Manager: LeaguePlayerModel;
  Name: string;
  DraftDate: Date;
  Settings: LeagueSettingsModel;
  Players: Array<LeaguePlayerModel>;
  Athletes: Array<LeagueAthleteModel>;
  LeagueType: SportEnum;
}
