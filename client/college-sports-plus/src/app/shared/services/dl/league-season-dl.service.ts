import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';

import { SportEnum } from '../../enums/sport.enum';
import { WeekStatusEnum } from '../../enums/week-status.enum';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeagueGameModel } from '../../models/league-game.model';
import { LeagueWeekModel } from '../../models/league-week.model';
import { BaseballRosterModel } from '../../models/roster/baseball-roster.model';
import { BasketballRosterModel } from '../../models/roster/basketball-roster.model';
import { FootballRosterModel } from '../../models/roster/football-roster.model';
import { SoccerRosterModel } from '../../models/roster/soccer-roster.model';
import { GeneralService } from '../bl/general-service.service';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { AthleteDLService } from './athlete-dl.service';
import { LeagueGameDLModel } from './models/league-game-dl.model';
import { LeagueWeekDLModel } from './models/league-week-dl.model';
import { BaseballRosterDLModel } from './models/roster/baseball-roster-dl.model';
import { BasketballRosterDLModel } from './models/roster/basketball-roster-dl.model';
import { FootballRosterDLModel } from './models/roster/football-roster-dl.model';
import { SoccerRosterDLModel } from './models/roster/soccer-roster-dl.model';

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
    week.Status = WeekStatusEnum.Current;
    week.Week = 1;
    week.Games = [];
    const game: LeagueGameDLModel = new LeagueGameDLModel();
    game.ID = '0';
    game.WeekNumber = 1;
    game.HomeTeamPlayerID = '0';
    const homeTeam: FootballRosterDLModel = new FootballRosterDLModel();
    // homeTeam.FirstTeamQB = '4433971';
    // homeTeam.FirstTeamRB1 = '4433971';
    // homeTeam.FirstTeamRB2 = '4433971';
    // homeTeam.FirstTeamWR1 = '4433971';
    // homeTeam.FirstTeamWR2 = '4433971';
    // homeTeam.FirstTeamTE = '4433971';
    // homeTeam.FirstTeamFLEX = '4433971';
    // homeTeam.FirstTeamDST = '4433971';
    // homeTeam.FirstTeamK = '4433971';
    // homeTeam.SecondTeamQB = '4433971';
    // homeTeam.SecondTeamRB1 = '4433971';
    // homeTeam.SecondTeamRB2 = '4433971';
    // homeTeam.SecondTeamWR1 = '4433971';
    // homeTeam.SecondTeamWR2 = '4433971';
    // homeTeam.SecondTeamTE = '4433971';
    // homeTeam.SecondTeamFLEX = '4433971';
    // homeTeam.SecondTeamDST = '4433971';
    // homeTeam.SecondTeamK = '4433971';
    // homeTeam.Bench1 = '4433971';
    // homeTeam.Bench2 = '4433971';
    // homeTeam.Bench3 = '4433971';
    // homeTeam.Bench4 = '4433971';
    // homeTeam.Bench5 = '4433971';
    // homeTeam.Bench6 = '4433971';
    game.HomeTeam = homeTeam;
    game.AwayTeamPlayerID = '1';
    const awayTeam: FootballRosterDLModel = new FootballRosterDLModel();
    // awayTeam.FirstTeamQB = '4433971';
    // awayTeam.FirstTeamRB1 = '4433971';
    // awayTeam.FirstTeamRB2 = '4433971';
    // awayTeam.FirstTeamWR1 = '4433971';
    // awayTeam.FirstTeamWR2 = '4433971';
    // awayTeam.FirstTeamTE = '4433971';
    // awayTeam.FirstTeamFLEX = '4433971';
    // awayTeam.FirstTeamDST = '4433971';
    // awayTeam.FirstTeamK = '4433971';
    // awayTeam.SecondTeamQB = '4433971';
    // awayTeam.SecondTeamRB1 = '4433971';
    // awayTeam.SecondTeamRB2 = '4433971';
    // awayTeam.SecondTeamWR1 = '4433971';
    // awayTeam.SecondTeamWR2 = '4433971';
    // awayTeam.SecondTeamTE = '4433971';
    // awayTeam.SecondTeamFLEX = '4433971';
    // awayTeam.SecondTeamDST = '4433971';
    // awayTeam.SecondTeamK = '4433971';
    // awayTeam.Bench1 = '4433971';
    // awayTeam.Bench2 = '4433971';
    // awayTeam.Bench3 = '4433971';
    // awayTeam.Bench4 = '4433971';
    // awayTeam.Bench5 = '4433971';
    // awayTeam.Bench6 = '4433971';
    game.AwayTeam = awayTeam;
    week.Games.push(game);
    weeks.push(week);

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
        weekDL.Games.forEach((gameDL) => {
          const game: LeagueGameModel = new LeagueGameModel();
          game.ID = gameDL.ID;
          game.WeekNumber = gameDL.WeekNumber;
          game.HomeTeamPlayerID = gameDL.HomeTeamPlayerID;
          game.HomeTeam = this.buildTeam(leagueType, gameDL.HomeTeam, athletes);
          game.AwayTeamPlayerID = gameDL.AwayTeamPlayerID;
          game.AwayTeam = this.buildTeam(leagueType, gameDL.AwayTeam, athletes);
          week.Games = [];
          week.Games.push(game);
        });
        season.push(week);
      }
    });
    return season;
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
      const homeTeamDL = GeneralService.GetLeagueRosterDLMap().get(leagueType);
      const awayTeamDL = GeneralService.GetLeagueRosterDLMap().get(leagueType);
      switch (leagueType) {
        case SportEnum.Baseball:
          break;
        case SportEnum.Basketball:
          break;
        case SportEnum.Football:
          (homeTeamDL as FootballRosterDLModel).FirstTeamQB =
            (game.HomeTeam as FootballRosterModel).FirstTeamQB?.AthleteID ?? '';
          (homeTeamDL as FootballRosterDLModel).FirstTeamRB1 =
            (game.HomeTeam as FootballRosterModel).FirstTeamRB1?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).FirstTeamRB2 =
            (game.HomeTeam as FootballRosterModel).FirstTeamRB2?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).FirstTeamWR1 =
            (game.HomeTeam as FootballRosterModel).FirstTeamWR1?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).FirstTeamWR2 =
            (game.HomeTeam as FootballRosterModel).FirstTeamWR2?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).FirstTeamTE =
            (game.HomeTeam as FootballRosterModel).FirstTeamTE?.AthleteID ?? '';
          (homeTeamDL as FootballRosterDLModel).FirstTeamFLEX =
            (game.HomeTeam as FootballRosterModel).FirstTeamFLEX?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).FirstTeamDST =
            (game.HomeTeam as FootballRosterModel).FirstTeamDST?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).FirstTeamK =
            (game.HomeTeam as FootballRosterModel).FirstTeamK?.AthleteID ?? '';
          (homeTeamDL as FootballRosterDLModel).SecondTeamQB =
            (game.HomeTeam as FootballRosterModel).SecondTeamQB?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).SecondTeamRB1 =
            (game.HomeTeam as FootballRosterModel).SecondTeamRB1?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).SecondTeamRB2 =
            (game.HomeTeam as FootballRosterModel).SecondTeamRB2?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).SecondTeamWR1 =
            (game.HomeTeam as FootballRosterModel).SecondTeamWR1?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).SecondTeamWR2 =
            (game.HomeTeam as FootballRosterModel).SecondTeamWR2?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).SecondTeamTE =
            (game.HomeTeam as FootballRosterModel).SecondTeamTE?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).SecondTeamFLEX =
            (game.HomeTeam as FootballRosterModel).SecondTeamFLEX?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).SecondTeamDST =
            (game.HomeTeam as FootballRosterModel).SecondTeamDST?.AthleteID ??
            '';
          (homeTeamDL as FootballRosterDLModel).SecondTeamK =
            (game.HomeTeam as FootballRosterModel).SecondTeamK?.AthleteID ?? '';
          (homeTeamDL as FootballRosterDLModel).Bench1 =
            (game.HomeTeam as FootballRosterModel).Bench1?.AthleteID ?? '';
          (homeTeamDL as FootballRosterDLModel).Bench2 =
            (game.HomeTeam as FootballRosterModel).Bench2?.AthleteID ?? '';
          (homeTeamDL as FootballRosterDLModel).Bench3 =
            (game.HomeTeam as FootballRosterModel).Bench3?.AthleteID ?? '';
          (homeTeamDL as FootballRosterDLModel).Bench4 =
            (game.HomeTeam as FootballRosterModel).Bench4?.AthleteID ?? '';
          (homeTeamDL as FootballRosterDLModel).Bench5 =
            (game.HomeTeam as FootballRosterModel).Bench5?.AthleteID ?? '';
          (homeTeamDL as FootballRosterDLModel).Bench6 =
            (game.HomeTeam as FootballRosterModel).Bench6?.AthleteID ?? '';
          (homeTeamDL as FootballRosterDLModel).IR =
            (game.HomeTeam as FootballRosterModel).IR?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).FirstTeamQB =
            (game.AwayTeam as FootballRosterModel).FirstTeamQB?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).FirstTeamRB1 =
            (game.AwayTeam as FootballRosterModel).FirstTeamRB1?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).FirstTeamRB2 =
            (game.AwayTeam as FootballRosterModel).FirstTeamRB2?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).FirstTeamWR1 =
            (game.AwayTeam as FootballRosterModel).FirstTeamWR1?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).FirstTeamWR2 =
            (game.AwayTeam as FootballRosterModel).FirstTeamWR2?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).FirstTeamTE =
            (game.AwayTeam as FootballRosterModel).FirstTeamTE?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).FirstTeamFLEX =
            (game.AwayTeam as FootballRosterModel).FirstTeamFLEX?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).FirstTeamDST =
            (game.AwayTeam as FootballRosterModel).FirstTeamDST?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).FirstTeamK =
            (game.AwayTeam as FootballRosterModel).FirstTeamK?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).SecondTeamQB =
            (game.AwayTeam as FootballRosterModel).SecondTeamQB?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).SecondTeamRB1 =
            (game.AwayTeam as FootballRosterModel).SecondTeamRB1?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).SecondTeamRB2 =
            (game.AwayTeam as FootballRosterModel).SecondTeamRB2?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).SecondTeamWR1 =
            (game.AwayTeam as FootballRosterModel).SecondTeamWR1?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).SecondTeamWR2 =
            (game.AwayTeam as FootballRosterModel).SecondTeamWR2?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).SecondTeamTE =
            (game.AwayTeam as FootballRosterModel).SecondTeamTE?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).SecondTeamFLEX =
            (game.AwayTeam as FootballRosterModel).SecondTeamFLEX?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).SecondTeamDST =
            (game.AwayTeam as FootballRosterModel).SecondTeamDST?.AthleteID ??
            '';
          (awayTeamDL as FootballRosterDLModel).SecondTeamK =
            (game.AwayTeam as FootballRosterModel).SecondTeamK?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).Bench1 =
            (game.AwayTeam as FootballRosterModel).Bench1?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).Bench2 =
            (game.AwayTeam as FootballRosterModel).Bench2?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).Bench3 =
            (game.AwayTeam as FootballRosterModel).Bench3?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).Bench4 =
            (game.AwayTeam as FootballRosterModel).Bench4?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).Bench5 =
            (game.AwayTeam as FootballRosterModel).Bench5?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).Bench6 =
            (game.AwayTeam as FootballRosterModel).Bench6?.AthleteID ?? '';
          (awayTeamDL as FootballRosterDLModel).IR =
            (game.AwayTeam as FootballRosterModel).IR?.AthleteID ?? '';
          break;
        case SportEnum.Soccer:
          break;
      }
      if (homeTeamDL && awayTeamDL) {
        gameDL.HomeTeam = homeTeamDL;
        gameDL.AwayTeam = awayTeamDL;
      }
    });
    weeks.push(weekDL);
    this._seasonDL.next(weeks);
  }

  private buildTeam(
    leagueType: SportEnum,
    roster:
      | BaseballRosterDLModel
      | BasketballRosterDLModel
      | SoccerRosterDLModel
      | FootballRosterDLModel,
    athletes: Array<LeagueAthleteModel>
  ):
    | BaseballRosterModel
    | BasketballRosterModel
    | FootballRosterModel
    | SoccerRosterModel {
    const rosterMap = new Map<
      SportEnum,
      | BaseballRosterModel
      | BasketballRosterModel
      | FootballRosterModel
      | SoccerRosterModel
    >([
      [SportEnum.Baseball, new BaseballRosterModel()],
      [SportEnum.Basketball, new BasketballRosterModel()],
      [SportEnum.Football, new FootballRosterModel()],
      [SportEnum.Soccer, new SoccerRosterModel()],
    ]);
    let retRoster = rosterMap.get(leagueType);
    switch (leagueType) {
      case SportEnum.Baseball:
      case SportEnum.Basketball:
      case SportEnum.Football:
        // this.athleteDLService.loadAthletes();
        const allAthletes = athletes;
        allAthletes;
        const playersIDS: Array<string> = [];
        const footballRosterDL: FootballRosterDLModel =
          roster as any as FootballRosterDLModel;
        playersIDS.push(footballRosterDL.FirstTeamQB);
        playersIDS.push(footballRosterDL.FirstTeamRB1);
        playersIDS.push(footballRosterDL.FirstTeamRB2);
        playersIDS.push(footballRosterDL.FirstTeamWR1);
        playersIDS.push(footballRosterDL.FirstTeamWR2);
        playersIDS.push(footballRosterDL.FirstTeamTE);
        playersIDS.push(footballRosterDL.FirstTeamFLEX);
        playersIDS.push(footballRosterDL.FirstTeamDST);
        playersIDS.push(footballRosterDL.FirstTeamK);
        playersIDS.push(footballRosterDL.SecondTeamQB);
        playersIDS.push(footballRosterDL.SecondTeamRB1);
        playersIDS.push(footballRosterDL.SecondTeamRB2);
        playersIDS.push(footballRosterDL.SecondTeamWR1);
        playersIDS.push(footballRosterDL.SecondTeamWR2);
        playersIDS.push(footballRosterDL.SecondTeamTE);
        playersIDS.push(footballRosterDL.SecondTeamFLEX);
        playersIDS.push(footballRosterDL.SecondTeamDST);
        playersIDS.push(footballRosterDL.SecondTeamK);
        playersIDS.push(footballRosterDL.Bench1);
        playersIDS.push(footballRosterDL.Bench2);
        playersIDS.push(footballRosterDL.Bench3);
        playersIDS.push(footballRosterDL.Bench4);
        playersIDS.push(footballRosterDL.Bench5);
        playersIDS.push(footballRosterDL.Bench6);
        const canGetPlayers = playersIDS.find((i) => i.length > 0);
        if (canGetPlayers) {
          const footballPlayers: Array<LeagueAthleteModel> = [];
          this.fastAPIService
            .getPlayersByIDs(playersIDS)
            .pipe(
              takeUntil(this.unsubscribe),
              map((data) => {
                data.forEach((pDL) => {
                  const p =
                    GeneralService.FastAPILeagueAthleteModelConverter(pDL);
                  if (p) {
                    footballPlayers.push(p);
                  }
                });
                console.log(data);
                const footballRoster: FootballRosterModel =
                  retRoster as any as FootballRosterModel;
                footballRoster.FirstTeamQB = footballPlayers[0];
                footballRoster.FirstTeamRB1 = footballPlayers[1];
                footballRoster.FirstTeamRB2 = footballPlayers[2];
                footballRoster.FirstTeamWR1 = footballPlayers[3];
                footballRoster.FirstTeamWR2 = footballPlayers[4];
                footballRoster.FirstTeamTE = footballPlayers[5];
                footballRoster.FirstTeamFLEX = footballPlayers[6];
                footballRoster.FirstTeamDST = footballPlayers[7];
                footballRoster.FirstTeamK = footballPlayers[8];
                footballRoster.SecondTeamQB = footballPlayers[9];
                footballRoster.SecondTeamRB1 = footballPlayers[10];
                footballRoster.SecondTeamRB2 = footballPlayers[11];
                footballRoster.SecondTeamWR1 = footballPlayers[12];
                footballRoster.SecondTeamWR2 = footballPlayers[13];
                footballRoster.SecondTeamTE = footballPlayers[14];
                footballRoster.SecondTeamFLEX = footballPlayers[15];
                footballRoster.SecondTeamDST = footballPlayers[16];
                footballRoster.SecondTeamK = footballPlayers[17];
                footballRoster.Bench1 = footballPlayers[18];
                footballRoster.Bench2 = footballPlayers[19];
                footballRoster.Bench3 = footballPlayers[20];
                footballRoster.Bench4 = footballPlayers[21];
                footballRoster.Bench5 = footballPlayers[22];
                footballRoster.Bench6 = footballPlayers[23];
                return retRoster;
              })
            )
            .subscribe({
              next: (team) => {
                retRoster = team;
              },
            });
        } else {
          return new FootballRosterModel();
        }
        break;
      case SportEnum.Soccer:
      default:
    }
    return retRoster ?? new FootballRosterModel();
  }
}
