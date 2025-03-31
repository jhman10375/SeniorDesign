import { RosterPositionEnum } from '../../../enums/roster-position.enum';

export class LeagueRosterAthleteDLModel {
  AthleteID: string;
  PlayerID: string;
  RosterPosition: RosterPositionEnum;
  RosterBackup: Boolean | undefined;
  RosterThird: Boolean | undefined;

  constructor() {
    this.AthleteID = '';
    this.PlayerID = '';
    this.RosterPosition = RosterPositionEnum.None;
    this.RosterBackup = undefined;
    this.RosterThird = undefined;
  }
}
