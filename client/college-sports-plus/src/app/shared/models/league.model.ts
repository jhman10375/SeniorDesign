import { LeagueAthleteModel } from './league-athlete.model';
import { LeaguePlayerModel } from './league-player.model';
import { LeagueSettingsModel } from './league-settings.model';

export class LeagueModel {
  ID: string;
  Manager: LeaguePlayerModel;
  Name: String;
  DraftDate: Date;
  Settings: LeagueSettingsModel;
  Players: Array<LeaguePlayerModel>;
  Athletes: Array<LeagueAthleteModel>;
}
