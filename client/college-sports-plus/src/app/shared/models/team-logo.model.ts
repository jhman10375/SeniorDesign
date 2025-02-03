import { HasID } from '../services/firebase/interfaces/has-id.interface';

export class TeamLogoModel implements HasID {
  ID: string;
  Abbreviation: string;
  AltName1: string | null;
  AltName2: string | null;
  AltName3: string | null;
  City: string | null;
  State: string | null;
  School: string | null;
  Logos: Array<string>;

  constructor() {
    this.ID = '';
    this.Abbreviation = '';
    this.AltName1 = '';
    this.AltName2 = '';
    this.AltName3 = '';
    this.City = '';
    this.State = '';
    this.School = '';
    this.Logos = [];
  }
}
