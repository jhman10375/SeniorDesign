import { Injectable } from '@angular/core';

import { SportEnum } from '../../enums/sport.enum';
import { BaseballLeagueSettingsModel } from '../../models/baseball-league-settings/baseball-league-settings.model';
import { BasketballLeagueSettingsModel } from '../../models/basketball-league-settings/basketball-league-settings.model';
import { FootballLeagueSettingsModel } from '../../models/football-league-settings/football-league-settings.model';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { SoccerLeagueSettingsModel } from '../../models/soccer-league-settings/soccer-league-settings.model';
import { BaseballRosterDLModel } from '../dl/models/roster/baseball-roster-dl.model';
import { BasketballRosterDLModel } from '../dl/models/roster/basketball-roster-dl.model';
import { FootballRosterDLModel } from '../dl/models/roster/football-roster-dl.model';
import { SoccerRosterDLModel } from '../dl/models/roster/soccer-roster-dl.model';
import { PlayerFAPIModel } from '../fastAPI/models/player-fapi.model';

@Injectable({ providedIn: 'root' })
export class GeneralService {
  static isMobile(): boolean {
    console.log(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  static GetLeagueSettingsModelMap(): Map<
    SportEnum,
    | FootballLeagueSettingsModel
    | SoccerLeagueSettingsModel
    | BaseballLeagueSettingsModel
    | BasketballLeagueSettingsModel
  > {
    const leagueSettingsModel: Map<
      SportEnum,
      | FootballLeagueSettingsModel
      | SoccerLeagueSettingsModel
      | BaseballLeagueSettingsModel
      | BasketballLeagueSettingsModel
    > = new Map<
      SportEnum,
      | FootballLeagueSettingsModel
      | SoccerLeagueSettingsModel
      | BaseballLeagueSettingsModel
      | BasketballLeagueSettingsModel
    >([
      [SportEnum.Baseball, new BaseballLeagueSettingsModel()],
      [SportEnum.Basketball, new BasketballLeagueSettingsModel()],
      [SportEnum.Football, new FootballLeagueSettingsModel()],
      [SportEnum.Soccer, new SoccerLeagueSettingsModel()],
    ]);

    return leagueSettingsModel;
  }

  static GetLeagueRosterDLMap(): Map<
    SportEnum,
    | FootballRosterDLModel
    | SoccerRosterDLModel
    | BaseballRosterDLModel
    | BasketballRosterDLModel
  > {
    const leagueRosterModel: Map<
      SportEnum,
      | FootballRosterDLModel
      | SoccerRosterDLModel
      | BaseballRosterDLModel
      | BasketballRosterDLModel
    > = new Map<
      SportEnum,
      | FootballRosterDLModel
      | SoccerRosterDLModel
      | BaseballRosterDLModel
      | BasketballRosterDLModel
    >([
      [SportEnum.Baseball, new BaseballRosterDLModel()],
      [SportEnum.Basketball, new BasketballRosterDLModel()],
      [SportEnum.Football, new FootballRosterDLModel()],
      [SportEnum.Soccer, new SoccerRosterDLModel()],
    ]);

    return leagueRosterModel;
  }

  static FastAPILeagueAthleteModelConverter(
    a: PlayerFAPIModel
  ): LeagueAthleteModel {
    const p: LeagueAthleteModel = new LeagueAthleteModel();
    p.AltColor = a.team_alt_color;
    p.AthleteID = a.player_id.toString();
    p.Color = a.team_color;
    p.Height = a.player_height;
    p.Jersey = a.player_jersey;
    try {
      if (typeof a.team_logos === 'string' && a.team_logos.startsWith('[')) {
        const cleanInput = a.team_logos.replace(/'/g, '"');
        try {
          p.Logos = JSON.parse(cleanInput);
        } catch {
          p.Logos = a.team_logos
            .slice(1, -1)
            .split(',')
            .map((url) => url.trim());
        }
      }
    } catch (error) {
      p.Logos = [];
      console.log(a);
      console.error('Error parsing array:', error);
    }
    p.Name = a.player_name;
    p.Position = a.player_position;
    p.School = a.player_team;
    p.Team = a.player_team;
    p.Weight = a.player_weight;
    p.Year = a.player_year;
    return p;
  }
}
