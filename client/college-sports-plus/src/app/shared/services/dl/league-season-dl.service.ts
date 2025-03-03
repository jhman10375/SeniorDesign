import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { RosterPositionEnum } from '../../enums/roster-position.enum';
import { SportEnum } from '../../enums/sport.enum';
import { WeekStatusEnum } from '../../enums/week-status.enum';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeagueGameModel } from '../../models/league-game.model';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';
import { LeagueWeekModel } from '../../models/league-week.model';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { AthleteDLService } from './athlete-dl.service';
import { LeagueGameDLModel } from './models/league-game-dl.model';
import { LeagueRosterAthleteDLModel } from './models/league-roster-athlete-dl.model';
import { LeagueWeekDLModel } from './models/league-week-dl.model';

@Injectable({ providedIn: 'root' })
export class LeagueSeasonDLService implements OnDestroy {
  seasonDL: Observable<Array<LeagueWeekDLModel>>;

  private _seasonDL = new BehaviorSubject<Array<LeagueWeekDLModel>>([]);

  private unsubscribe = new Subject<void>();

  constructor(
    private fastAPIService: FastAPIService,
    private athleteDLService: AthleteDLService
  ) {
    this.seasonDL = this._seasonDL.asObservable();
    this.initializeSeasons();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  initializeSeasons(): void {
    const weeks: Array<LeagueWeekDLModel> = [];
    const week: LeagueWeekDLModel = new LeagueWeekDLModel();
    week.ID = '0';
    week.LeagueID = '0';
    week.Status = WeekStatusEnum.Played;
    week.Week = 1;
    week.Games = [];

    const p: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p.AthleteID = '4433971';
    p.RosterPosition = RosterPositionEnum.FirstString;
    p.PlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';

    const p1: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p1.AthleteID = '5084084';
    p1.RosterPosition = RosterPositionEnum.FirstString;
    p1.PlayerID = '1';

    const p2: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p2.AthleteID = '4574356';
    p2.RosterPosition = RosterPositionEnum.FirstString;
    p2.PlayerID = '2';

    const p3: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p3.AthleteID = '4689114';
    p3.RosterPosition = RosterPositionEnum.B1;
    p3.PlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';

    const p4: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p4.AthleteID = '4688380';
    p4.RosterPosition = RosterPositionEnum.SecondString;
    p4.PlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';

    const game: LeagueGameDLModel = new LeagueGameDLModel();
    game.ID = '0';
    game.WeekNumber = 1;
    game.HomeTeamPlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';
    game.HomeTeam = [p, p3, p4];
    game.AwayTeamPlayerID = '1';
    game.AwayTeam = [p1];
    week.Games.push(game);

    const game1: LeagueGameDLModel = new LeagueGameDLModel();
    game1.ID = '1';
    game1.WeekNumber = 1;
    game1.HomeTeamPlayerID = '1';
    game1.HomeTeam = [p1];
    game1.AwayTeamPlayerID = '2';
    game1.AwayTeam = [p2];
    week.Games.push(game1);

    // const game2: LeagueGameDLModel = new LeagueGameDLModel();
    // game2.ID = '2';
    // game2.WeekNumber = 1;
    // game2.HomeTeamPlayerID = '2';
    // game2.HomeTeam = [p2];
    // game2.AwayTeamPlayerID = '0';
    // game2.AwayTeam = [p];
    // week.Games.push(game2);

    weeks.push(week);

    const week1: LeagueWeekDLModel = new LeagueWeekDLModel();
    week1.ID = '1';
    week1.LeagueID = '0';
    week1.Status = WeekStatusEnum.Current;
    week1.Week = 2;
    week1.Games = [];

    const p5: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p5.AthleteID = '4433971';
    p5.RosterPosition = RosterPositionEnum.FirstString;
    p5.PlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';

    const p6: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p6.AthleteID = '5084084';
    p6.RosterPosition = RosterPositionEnum.FirstString;
    p6.PlayerID = '1';

    const p7: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p7.AthleteID = '4574356';
    p7.RosterPosition = RosterPositionEnum.FirstString;
    p7.PlayerID = '2';

    const p8: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p8.AthleteID = '4689114';
    p8.RosterPosition = RosterPositionEnum.B1;
    p8.PlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';

    const p9: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p9.AthleteID = '4688380';
    p9.RosterPosition = RosterPositionEnum.SecondString;
    p9.PlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';

    const game2: LeagueGameDLModel = new LeagueGameDLModel();
    game2.ID = '2';
    game2.WeekNumber = 2;
    game2.HomeTeamPlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';
    game2.HomeTeam = [p, p3, p4];
    game2.AwayTeamPlayerID = '1';
    game2.AwayTeam = [p1];
    week1.Games.push(game2);

    const game3: LeagueGameDLModel = new LeagueGameDLModel();
    game3.ID = '3';
    game3.WeekNumber = 2;
    game3.HomeTeamPlayerID = '1';
    game3.HomeTeam = [p1];
    game3.AwayTeamPlayerID = '2';
    game3.AwayTeam = [p2];
    week1.Games.push(game3);

    weeks.push(week1);

    const week2: LeagueWeekDLModel = new LeagueWeekDLModel();
    week2.ID = '2';
    week2.LeagueID = '0';
    week2.Status = WeekStatusEnum.Future;
    week2.Week = 3;
    week2.Games = [];

    const p10: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p10.AthleteID = '4433971';
    p10.RosterPosition = RosterPositionEnum.FirstString;
    p10.PlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';

    const p11: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p11.AthleteID = '5084084';
    p11.RosterPosition = RosterPositionEnum.FirstString;
    p11.PlayerID = '1';

    const p12: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p12.AthleteID = '4574356';
    p12.RosterPosition = RosterPositionEnum.FirstString;
    p12.PlayerID = '2';

    const p13: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p13.AthleteID = '4689114';
    p13.RosterPosition = RosterPositionEnum.B1;
    p13.PlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';

    const p14: LeagueRosterAthleteDLModel = new LeagueRosterAthleteDLModel();
    p14.AthleteID = '4688380';
    p14.RosterPosition = RosterPositionEnum.SecondString;
    p14.PlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';

    const game4: LeagueGameDLModel = new LeagueGameDLModel();
    game4.ID = '4';
    game4.WeekNumber = 3;
    game4.HomeTeamPlayerID = '9vnblV3TFHb7XNisPvkX2tTTkhj2';
    game4.HomeTeam = [p, p3, p4];
    game4.AwayTeamPlayerID = '1';
    game4.AwayTeam = [p1];
    week2.Games.push(game4);

    const game5: LeagueGameDLModel = new LeagueGameDLModel();
    game5.ID = '5';
    game5.WeekNumber = 3;
    game5.HomeTeamPlayerID = '1';
    game5.HomeTeam = [p1];
    game5.AwayTeamPlayerID = '2';
    game5.AwayTeam = [p2];
    week2.Games.push(game5);

    weeks.push(week2);

    this._seasonDL.next(weeks);
  }

  getSeason(
    leagueID: string,
    leagueType: SportEnum,
    athletes: Array<LeagueAthleteModel>
  ): Array<LeagueWeekModel> {
    const season: Array<LeagueWeekModel> = [];
    this._seasonDL.value.forEach((weekDL) => {
      if (weekDL.LeagueID == leagueID) {
        const week: LeagueWeekModel = new LeagueWeekModel();
        week.ID = weekDL.ID;
        week.LeagueID = weekDL.LeagueID;
        week.Status = weekDL.Status;
        week.Week = weekDL.Week;
        week.Games = [];
        weekDL.Games.forEach((gameDL) => {
          const game: LeagueGameModel = new LeagueGameModel();
          game.ID = gameDL.ID;
          game.WeekNumber = gameDL.WeekNumber;
          game.HomeTeamPlayerID = gameDL.HomeTeamPlayerID;
          game.HomeTeam = this.buildTeam(leagueType, gameDL.HomeTeam, athletes);
          game.AwayTeamPlayerID = gameDL.AwayTeamPlayerID;
          game.AwayTeam = this.buildTeam(leagueType, gameDL.AwayTeam, athletes);
          week.Games.push(game);
        });
        season.push(week);
      }
    });
    return season;
  }

  updateTeam(
    leagueType: SportEnum,
    week: LeagueWeekModel,
    teamID: string,
    team: Array<LeagueRosterAthleteModel>
  ): void {
    const game = week.Games.find(
      (x) => x.AwayTeamPlayerID == teamID || x.HomeTeamPlayerID == teamID
    );
    if (game && game.AwayTeamPlayerID == teamID) {
      game.AwayTeam = team;
    } else if (game && game.HomeTeamPlayerID == teamID) {
      game.HomeTeam = team;
    }
    this.updateSeason(leagueType, week);
  }

  updateSeason(leagueType: SportEnum, week: LeagueWeekModel): void {
    const weeks = this._seasonDL.value.filter((x) => x.ID != week.ID);
    const weekDL: LeagueWeekDLModel = new LeagueWeekDLModel();
    weekDL.ID = week.ID;
    weekDL.LeagueID = week.LeagueID;
    weekDL.Status = week.Status;
    weekDL.Week = week.Week;
    week.Games.forEach((game) => {
      const gameDL: LeagueGameDLModel = new LeagueGameDLModel();
      gameDL.ID = game.ID;
      gameDL.WeekNumber = game.WeekNumber;
      gameDL.HomeTeamPlayerID = game.HomeTeamPlayerID;
      gameDL.AwayTeamPlayerID = game.AwayTeamPlayerID;
      switch (leagueType) {
        case SportEnum.Baseball:
          break;
        case SportEnum.Basketball:
          break;
        case SportEnum.Football:
          game.HomeTeam.forEach((rosterAthlete) => {
            const rosterAthleteDL: LeagueRosterAthleteDLModel =
              new LeagueRosterAthleteDLModel();
            rosterAthleteDL.AthleteID = rosterAthlete.Athlete.AthleteID;
            rosterAthleteDL.PlayerID = rosterAthlete.Athlete.PlayerID ?? '';
            rosterAthleteDL.RosterBackup = rosterAthlete.RosterBackup;
            rosterAthleteDL.RosterPosition = rosterAthlete.RosterPosition;
            gameDL.HomeTeam.push(rosterAthleteDL);
          });
          game.AwayTeam.forEach((rosterAthlete) => {
            const rosterAthleteDL: LeagueRosterAthleteDLModel =
              new LeagueRosterAthleteDLModel();
            rosterAthleteDL.AthleteID = rosterAthlete.Athlete.AthleteID;
            rosterAthleteDL.PlayerID = rosterAthlete.Athlete.PlayerID ?? '';
            rosterAthleteDL.RosterBackup = rosterAthlete.RosterBackup;
            rosterAthleteDL.RosterPosition = rosterAthlete.RosterPosition;
            gameDL.AwayTeam.push(rosterAthleteDL);
          });
          break;
        case SportEnum.Soccer:
          break;
      }
      weekDL.Games.push(gameDL);
    });
    weeks.push(weekDL);
    this._seasonDL.next(weeks);
  }

  private buildTeam(
    leagueType: SportEnum,
    roster: Array<LeagueRosterAthleteDLModel>,
    athletes: Array<LeagueAthleteModel>
  ): Array<LeagueRosterAthleteModel> {
    const retRoster: Array<LeagueRosterAthleteModel> = [];
    switch (leagueType) {
      case SportEnum.Baseball:
      case SportEnum.Basketball:
      case SportEnum.Football:
        roster.forEach((athlete) => {
          const rosterAthleteModel: LeagueRosterAthleteModel =
            new LeagueRosterAthleteModel();
          rosterAthleteModel.RosterBackup = athlete.RosterBackup;
          rosterAthleteModel.RosterPosition = athlete.RosterPosition;
          rosterAthleteModel.Athlete =
            athletes.find((x) => x.AthleteID === athlete.AthleteID) ??
            new LeagueAthleteModel();
          retRoster.push(rosterAthleteModel);
        });
        break;
      case SportEnum.Soccer:
      default:
    }
    return retRoster ?? [];
  }
}
