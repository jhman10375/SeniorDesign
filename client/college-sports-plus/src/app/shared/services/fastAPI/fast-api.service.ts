import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DraftCreatePickOrderDataWSModel } from '../../../pages/league/draft-hub/football-draft/models/draft-create-pick-order-data.model';
import { SportEnum } from '../../enums/sport.enum';
import { SchoolLocationModel } from '../../models/school-location.model';
import { SchoolModel } from '../../models/school.model';
import { BaseballPlayerStatsModel } from '../../models/stats/baseball-player-stats.model';
import { BasketballPlayerStatsModel } from '../../models/stats/basketball-player-stats.model';
import { FootballPlayerStatsModel } from '../../models/stats/football-player-stats.model';
import { SoccerPlayerStatsModel } from '../../models/stats/soccer-player-stats.model';
import { TeamLogoModel } from '../../models/team-logo.model';
import { PlayerFAPIModel } from './models/player-fapi.model';
import { SchoolFAPIModel } from './models/school-fapi.model';
import { BaseballPlayerStatsFAPIModel } from './models/stats/baseball-player-stats-fai.model';
import { BasketballPlayerStatsFAPIModel } from './models/stats/basketball-player-stats-fapi.model';
import { FootballPlayerStatsFAPIModel } from './models/stats/football-player-stats-fapi.model';
import { SoccerPlayerStatsFAPIModel } from './models/stats/soccer-player-stats-fapi.model';
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
      .get<Array<SchoolFAPIModel>>(this.url + 'schools/get_all')
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

  getPlayerByID(
    playerID: string,
    leagueType: SportEnum
  ): Observable<PlayerFAPIModel | undefined> {
    switch (leagueType) {
      case SportEnum.Football:
        return this.getFootballPlayerByID(playerID);
      case SportEnum.Baseball:
        return this.getBaseballPlayerByID(playerID);
      case SportEnum.Basketball:
        return this.getBasketballPlayerByID(playerID);
      case SportEnum.Soccer:
        return this.getSoccerPlayerByID(playerID);
      default:
        return of(undefined);
    }
  }

  getFootballPlayerByID(id: string): Observable<PlayerFAPIModel> {
    return this.httpClient.get<PlayerFAPIModel>(
      this.url + 'players/search/by_id/' + id + '?player_id=' + id
    );
  }

  getBasketballPlayerByID(id: string): Observable<PlayerFAPIModel> {
    return this.httpClient.get<PlayerFAPIModel>(
      this.url + 'bkb/players/search/by_id/' + id + '?player_id=' + id
    );
  }

  getBaseballPlayerByID(id: string): Observable<PlayerFAPIModel> {
    return this.httpClient.get<PlayerFAPIModel>(
      this.url + 'bsb/players/search/by_id/' + id + '?player_id=' + id
    );
  }

  getSoccerPlayerByID(id: string): Observable<PlayerFAPIModel> {
    return this.httpClient.get<PlayerFAPIModel>(
      this.url + 'scc/players/search/by_id/' + id + '?player_id=' + id
    );
  }

  getFootballPlayerStatsByID(
    id: string,
    season: number
  ): Observable<FootballPlayerStatsModel> {
    return this.httpClient
      .get<FootballPlayerStatsFAPIModel>(
        this.url + 'player/' + id + '/stats/full_year?season=' + season
      )
      .pipe(
        map((x) => {
          const p = new FootballPlayerStatsModel();
          p.ExtraPoints = x.extra_points;
          p.ExtraPointsMissed = x.extra_points_missed;
          p.FieldGoals = x.field_goals;
          p.FieldGoalsMissed = x.field_goals_missed;
          p.FumblesLost = x.fumbles_lost;
          p.Interceptions = x.interceptions;
          p.PassTD = x.pass_TD;
          p.PassYds = x.pass_yds;
          p.PlayerID = x.player_ID.toString();
          p.PlayerName = x.player_name;
          p.PlayerPosition = x.player_position;
          p.ReceptionTD = x.reception_TD;
          p.ReceptionYds = x.reception_yds;
          p.Receptions = x.receptions;
          p.RushTD = x.rush_TD;
          p.RushYds = x.rush_yds;
          return p;
        })
      );
  }

  getBaseballPlayerStatsByID(
    id: string,
    season: number
  ): Observable<BaseballPlayerStatsModel> {
    return this.httpClient
      .get<BaseballPlayerStatsFAPIModel>(
        this.url + 'bsb/player/' + id + '/stats/full_year?season=' + season
      )
      .pipe(
        map((x) => {
          const p = new BaseballPlayerStatsModel();
          p.CaughtStealing = x.caught_stealing;
          p.Doubles = x.doubles;
          p.EarnedRunsAllowed = x.earned_runs_allowed;
          p.HitsByPitch = x.hits_by_pitch;
          p.Homers = x.homers;
          p.Innings = x.innings;
          p.PlayerID = x.player_id.toString();
          p.PlayerName = x.player_name;
          p.PlayerPosition = x.player_position;
          p.Runs = x.runs;
          p.RunsBattedIn = x.runs_batted_in;
          p.Saves = x.saves;
          p.Singles = x.singles;
          p.StolenBases = x.stolen_bases;
          p.Triples = x.triples;
          p.Walks = x.walks;
          p.Win = x.win;
          return p;
        })
      );
  }

  getBasketballPlayerStatsByID(
    id: string,
    season: number
  ): Observable<BasketballPlayerStatsModel> {
    return this.httpClient
      .get<BasketballPlayerStatsFAPIModel>(
        this.url + 'bkb/player/' + id + '/stats/full_year?season=' + season
      )
      .pipe(
        map((x) => {
          const p = new BasketballPlayerStatsModel();
          p.Assists = x.assists;
          p.BlockedShots = x.blocked_shots;
          p.FreeThrows = x.free_throws;
          p.PlayerID = x.player_ID.toString();
          p.PlayerName = x.player_name;
          p.PlayerPosition = x.player_position;
          p.Rebounds = x.rebounds;
          p.Steals = x.steals;
          p.ThreePointers = x.three_pointers;
          p.Turnovers = x.turnovers;
          p.TwoPointers = x.two_pointers;
          return p;
        })
      );
  }

  getSoccerPlayerStatsByID(
    id: string,
    season: number
  ): Observable<SoccerPlayerStatsModel> {
    return this.httpClient
      .get<SoccerPlayerStatsFAPIModel>(
        this.url + 'scc/player/' + id + '/stats/full_year?season=' + season
      )
      .pipe(
        map((x) => {
          const p = new SoccerPlayerStatsModel();
          p.Assists = x.assists;
          p.CleanSheet = x.clean_sheet;
          p.Fouls = x.fouls;
          p.Goals = x.goals;
          p.GoalsAllowed = x.goals_allowed;
          p.PlayerID = x.player_id.toString();
          p.PlayerName = x.player_name;
          p.PlayerPosition = x.player_position;
          p.RedCards = x.red_cards;
          p.Saves = x.saves;
          p.ShotsOffGoal = x.shots_off_goal;
          p.ShotsOnGoal = x.shots_on_goal;
          p.YellowCards = x.yellow_cards;
          return p;
        })
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

  createFootballDraft(data: DraftCreatePickOrderDataWSModel): Observable<any> {
    return this.httpClient.post<string>(this.url + 'fb/create-draft', data);
  }

  createSoccerDraft(data: DraftCreatePickOrderDataWSModel): Observable<any> {
    return this.httpClient.post<string>(this.url + 'scc/create-draft', data);
  }

  createBasketballDraft(
    data: DraftCreatePickOrderDataWSModel
  ): Observable<any> {
    return this.httpClient.post<string>(this.url + 'bkb/create-draft', data);
  }

  createBaseballDraft(data: DraftCreatePickOrderDataWSModel): Observable<any> {
    return this.httpClient.post<string>(this.url + 'bsb/create-draft', data);
  }

  // Basketball
  getBasketballPlayers(): Observable<Array<PlayerFAPIModel>> {
    return this.httpClient.get<Array<PlayerFAPIModel>>(
      this.url + 'bkb/players/get_first_string?page=1&page_size=999999'
    );
  }

  // Baseball
  getBaseballPlayers(): Observable<Array<PlayerFAPIModel>> {
    return this.httpClient.get<Array<PlayerFAPIModel>>(
      this.url + 'bsb/players/get_first_string?page=1&page_size=999999'
    );
  }

  // Soccer
  getSoccerPlayers(): Observable<Array<PlayerFAPIModel>> {
    return this.httpClient.get<Array<PlayerFAPIModel>>(
      this.url + 'scc/players/get_first_string?page=1&page_size=999999'
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
