import { HasID } from '../services/firebase/interfaces/has-id.interface';

export class LeagueConferenceModel implements HasID {
  ID: string;
  LeagueID: string;
  ConferenceName: string;
}
