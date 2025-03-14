import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DraftCreatePickOrderDataWSModel } from '../../../pages/league/draft/models/draft-create-pick-order-data.model';
import { SchoolLocationModel } from '../../models/school-location.model';
import { SchoolModel } from '../../models/school.model';
import { TeamLogoModel } from '../../models/team-logo.model';
import { PlayerFAPIModel } from './models/player-fapi.model';
import { SchoolFAPIModel } from './models/school-fapi.model';
import { TeamLogoFAPIModel } from './models/team-logo-fapi.model';
import { WeekFAPIModel } from './models/week-fapi.model';

@Injectable({ providedIn: 'root' })
export class FastAPIService {
  private readonly url = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  getStatus(): any {
    this.httpClient.get<{ status: string }>(this.url + 'status').subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  getLogos(): Observable<Array<TeamLogoModel>> {
    return this.httpClient
      .get<Array<TeamLogoFAPIModel>>(this.url + 'teams/logos/{}')
      .pipe(
        map((x) => {
          const teeamLogos: Array<TeamLogoModel> = [];
          x.forEach((logo) => {
            const newTeamLogoModel: TeamLogoModel = new TeamLogoModel();
            newTeamLogoModel.ID = logo.id;
            newTeamLogoModel.Abbreviation = logo.abbreviation;
            newTeamLogoModel.AltName1 = logo.alt_name_1;
            newTeamLogoModel.AltName2 = logo.alt_name_2;
            newTeamLogoModel.AltName3 = logo.alt_name_3;
            newTeamLogoModel.City = logo.city;
            newTeamLogoModel.School = logo.school;
            newTeamLogoModel.State = logo.state;
            newTeamLogoModel.Logos = logo.logos;
            teeamLogos.push(newTeamLogoModel);
          });
          return teeamLogos;
        })
      );
  }

  getTeams(team: string): any {
    this.httpClient
      .get<any>(this.url + 'teams/' + team + '?season=2024')
      .subscribe({
        next: (data) => {
          console.log(team, data);
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  getAllSchools(): Observable<Array<SchoolModel>> {
    return this.httpClient
      .get<Array<SchoolFAPIModel>>(this.url + 'schools/get_all/')
      .pipe(
        map((x) => {
          const retArr: Array<SchoolModel> = [];
          x.forEach((s) => {
            const school: SchoolModel = new SchoolModel();
            school.Abbreviation = s.abbreviation;
            school.AltColor = s.alt_color;
            school.AltName1 = s.alt_name_1;
            school.AltName2 = s.alt_name_2;
            school.AltName3 = s.alt_name_3;
            school.Color = s.color;
            school.Conference = s.conference;
            school.Division = s.division;
            school.ID = s.id;
            school.Logos = s.logos;
            school.Mascot = s.mascot;
            school.School = s.school;
            school.Twitter = s.twitter;
            const location: SchoolLocationModel = new SchoolLocationModel();
            location.Capacity = s.location.capacity;
            location.City = s.location.city;
            location.CountryCode = s.location.country_code;
            location.Dome = s.location.dome;
            location.Elevation = s.location.elevation;
            location.Grass = s.location.grass;
            location.Latitude = s.location.latitude;
            location.Longitude = s.location.longitude;
            location.Name = s.location.name;
            location.State = s.location.state;
            location.Timezone = s.location.timezone;
            location.VenueID = s.location.venue_id;
            location.YearConstructed = s.location.year_constructed;
            location.Zip = s.location.zip;
            school.Location = location;
            retArr.push(school);
          });
          return retArr;
        })
      );
  }

  getSchoolByName(name: string): Observable<SchoolModel | null> {
    return this.httpClient
      .get<SchoolFAPIModel | null>(this.url + 'schools/get_by_name/' + name)
      .pipe(
        map((x) => {
          if (x != null) {
            const school: SchoolModel = new SchoolModel();
            school.Abbreviation = x.abbreviation;
            school.AltColor = x.alt_color;
            school.AltName1 = x.alt_name_1;
            school.AltName2 = x.alt_name_2;
            school.AltName3 = x.alt_name_3;
            school.Color = x.color;
            school.Conference = x.conference;
            school.Division = x.division;
            school.ID = x.id;
            school.Logos = x.logos;
            school.Mascot = x.mascot;
            school.School = x.school;
            school.Twitter = x.twitter;
            const location: SchoolLocationModel = new SchoolLocationModel();
            location.Capacity = x.location.capacity;
            location.City = x.location.city;
            location.CountryCode = x.location.country_code;
            location.Dome = x.location.dome;
            location.Elevation = x.location.elevation;
            location.Grass = x.location.grass;
            location.Latitude = x.location.latitude;
            location.Longitude = x.location.longitude;
            location.Name = x.location.name;
            location.State = x.location.state;
            location.Timezone = x.location.timezone;
            location.VenueID = x.location.venue_id;
            location.YearConstructed = x.location.year_constructed;
            location.Zip = x.location.zip;
            school.Location = location;

            return school;
          } else {
            return null;
          }
        })
      );
  }

  getTeamByID(teamID: string): Observable<SchoolModel> {
    return this.httpClient
      .get<SchoolFAPIModel>(this.url + 'team/get_by_id/' + teamID)
      .pipe(
        map((x) => {
          const school: SchoolModel = new SchoolModel();
          school.Abbreviation = x.abbreviation;
          school.AltColor = x.alt_color;
          school.AltName1 = x.alt_name_1;
          school.AltName2 = x.alt_name_2;
          school.AltName3 = x.alt_name_3;
          school.Color = x.color;
          school.Conference = x.conference;
          school.Division = x.division;
          school.ID = x.id;
          school.Logos = x.logos;
          school.Mascot = x.mascot;
          school.School = x.school;
          school.Twitter = x.twitter;
          const location: SchoolLocationModel = new SchoolLocationModel();
          location.Capacity = x.location.capacity;
          location.City = x.location.city;
          location.CountryCode = x.location.country_code;
          location.Dome = x.location.dome;
          location.Elevation = x.location.elevation;
          location.Grass = x.location.grass;
          location.Latitude = x.location.latitude;
          location.Longitude = x.location.longitude;
          location.Name = x.location.name;
          location.State = x.location.state;
          location.Timezone = x.location.timezone;
          location.VenueID = x.location.venue_id;
          location.YearConstructed = x.location.year_constructed;
          location.Zip = x.location.zip;
          school.Location = location;
          return school;
        })
      );
  }

  getPlayers(): Observable<Array<PlayerFAPIModel>> {
    return this.httpClient.get<Array<PlayerFAPIModel>>(
      this.url + 'players/get_first_string?page=1&page_size=999999'
    );
  }

  getPlayerByID(id: string): Observable<PlayerFAPIModel> {
    return this.httpClient.get<PlayerFAPIModel>(
      this.url + 'players/search/by_id/' + id + '?player_id=' + id
    );
  }

  getPlayersByIDs(
    playerIDs: Array<string>
  ): Observable<Array<PlayerFAPIModel>> {
    return this.httpClient.get<Array<PlayerFAPIModel>>(
      this.url +
        'players/search/by_ids?player_ids=' +
        `%5B${playerIDs.join(',')}%5D`
    );
  }

  createDraft(data: DraftCreatePickOrderDataWSModel): Observable<any> {
    return this.httpClient.post<string>(this.url + 'create-draft', data);
  }

  // Basketball
  getBasketballPlayers(): Observable<Array<PlayerFAPIModel>> {
    return this.httpClient.get<Array<PlayerFAPIModel>>(
      this.url + 'bkb/players/get_first_string?page=1&page_size=999999'
    );
  }

  // League Tools
  getLeagueSchedule(
    numTeams: number = 8,
    numWeeks: number = 10
  ): Observable<Array<WeekFAPIModel>> {
    return this.httpClient.get<Array<WeekFAPIModel>>(
      this.url +
        `league-tools/generate_schedule/?num_teams=${numTeams}&num_weeks=${numWeeks}`
    );
  }
}
