export class SchoolLocationFAPIModel {
  capacity: number;
  city: string;
  country_code: string;
  dome: boolean;
  elevation: number;
  grass: boolean;
  latitude: number;
  longitude: number;
  name: string;
  state: string;
  timezone: string;
  venue_id: number;
  year_constructed: number;
  zip: string;

  constructor() {
    this.capacity = -1;
    this.city = '';
    this.country_code = '';
    this.dome = false;
    this.elevation = -1;
    this.grass = false;
    this.latitude = -1;
    this.longitude = -1;
    this.name = '';
    this.state = '';
    this.timezone = '';
    this.venue_id = -1;
    this.year_constructed = -1;
    this.zip = '';
  }
}
