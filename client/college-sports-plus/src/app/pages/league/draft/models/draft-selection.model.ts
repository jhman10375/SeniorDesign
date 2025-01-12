import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';

export class DraftSelectionModel {
  ID: string;
  Name: string;
  Players: Array<LeagueAthleteModel | null>;

  constructor() {
    this.ID = '';
    this.Name = '';
    this.Players = [];
  }
}
