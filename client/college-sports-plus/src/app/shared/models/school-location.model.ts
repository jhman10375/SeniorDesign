export class SchoolLocationModel {
  VenueID: number;
  Name: string;
  City: string;
  State: string;
  Zip: string;
  CountryCode: string;
  Timezone: string;
  Latitude: number;
  Longitude: number;
  Elevation: number;
  Capacity: number;
  YearConstructed: number;
  Grass: boolean;
  Dome: boolean;

  constructor() {
    this.VenueID = -1;
    this.Name = '';
    this.City = '';
    this.State = '';
    this.Zip = '';
    this.CountryCode = '';
    this.Timezone = '';
    this.Latitude = -1;
    this.Longitude = -1;
    this.Elevation = -1;
    this.Capacity = -1;
    this.YearConstructed = -1;
    this.Grass = false;
    this.Dome = false;
  }
}
