import { RosterPositionEnum } from '../enums/roster-position.enum';
import { LeagueAthleteModel } from './league-athlete.model';

export class LeagueRosterAthleteModel {
  Athlete: LeagueAthleteModel;
  RosterPosition: RosterPositionEnum;
  RosterBackup: Boolean | undefined;

  constructor() {
    this.Athlete = new LeagueAthleteModel();
    this.RosterPosition = RosterPositionEnum.None;
    this.RosterBackup = undefined;
  }
}
