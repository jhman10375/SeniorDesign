import { SchoolLocationFAPIModel } from './school-location-fapi.model';

export class SchoolFAPIModel {
  id: string;
  school: string;
  mascot: string;
  abbreviation: string;
  alt_name_1: string;
  alt_name_2: string;
  alt_name_3: string;
  conference: string;
  division: string;
  color: string;
  alt_color: string;
  logos: Array<string>;
  twitter: string;
  location: SchoolLocationFAPIModel;

  constructor() {
    this.id = '';
    this.school = '';
    this.mascot = '';
    this.abbreviation = '';
    this.alt_name_1 = '';
    this.alt_name_2 = '';
    this.alt_name_3 = '';
    this.conference = '';
    this.division = '';
    this.color = '';
    this.alt_color = '';
    this.logos = [];
    this.twitter = '';
    this.location = new SchoolLocationFAPIModel();
  }
}
