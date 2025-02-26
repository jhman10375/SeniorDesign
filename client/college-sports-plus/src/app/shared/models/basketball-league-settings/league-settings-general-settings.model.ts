import { LeaguePlayerModel } from '../league-player.model';

export class GeneralSettingsModel {
  Name: string;
  NumberOfTeams: number;
  LeagueManager: LeaguePlayerModel;
  PublicLeague: boolean;
  Passcode: string;
  PrimaryColor: string;
  SecondaryColor: string;

  constructor() {
    this.Name = '';
    this.NumberOfTeams = 4;
    this.LeagueManager = new LeaguePlayerModel();
    this.PublicLeague = true;
    this.Passcode = '';
    this.PrimaryColor = '#0000FF';
    this.SecondaryColor = '#00FF00';
  }
}
