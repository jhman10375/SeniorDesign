export class TeamLogoFAPIModel {
  id: string;
  abbreviation: string;
  alt_name_1: string | null;
  alt_name_2: string | null;
  alt_name_3: string | null;
  city: string | null;
  state: string | null;
  school: string | null;
  logos: Array<string>;

  constructor() {
    this.id = '';
    this.abbreviation = '';
    this.alt_name_1 = '';
    this.alt_name_2 = '';
    this.alt_name_3 = '';
    this.city = '';
    this.state = '';
    this.school = '';
    this.logos = [];
  }
}
