import { LeagueAthleteModel } from '../../../../../shared/models/league-athlete.model';
import { HasID } from '../../../../../shared/services/firebase/interfaces/has-id.interface';

export class DraftSelectionModel implements HasID {
  ID: string;
  Name: string;
  Players: Array<LeagueAthleteModel | null>;

  constructor() {
    this.ID = '';
    this.Name = '';
    this.Players = [];
  }
}
