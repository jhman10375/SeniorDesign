import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';

export class DraftSelectionModel {
  ID: string;
  Name: string;
  Players: Array<LeagueAthleteModel>;

  constructor() {
    this.ID = '';
    this.Name = '';
    this.Players = [];
  }
}
