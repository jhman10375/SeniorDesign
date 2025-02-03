import { HasID } from '../services/firebase/interfaces/has-id.interface';
import { SchoolLocationModel } from './school-location.model';

export class SchoolModel implements HasID {
  ID: string;
  School: string;
  Mascot: string;
  Abbreviation: string;
  AltName1: string;
  AltName2: string;
  AltName3: string;
  Conference: string;
  Division: string;
  Color: string;
  AltColor: string;
  Logos: Array<string>;
  Twitter: string;
  Location: SchoolLocationModel;

  constructor() {
    this.ID = '';
    this.School = '';
    this.Mascot = '';
    this.Abbreviation = '';
    this.AltName1 = '';
    this.AltName2 = '';
    this.AltName3 = '';
    this.Conference = '';
    this.Division = '';
    this.Color = '';
    this.AltColor = '';
    this.Logos = [];
    this.Twitter = '';
    this.Location = new SchoolLocationModel();
  }
}
