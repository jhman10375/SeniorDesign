import { Injectable, OnDestroy } from '@angular/core';
import {
  AngularFirestore,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { SportEnum } from '../../enums/sport.enum';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeagueGameModel } from '../../models/league-game.model';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';
import { LeagueWeekModel } from '../../models/league-week.model';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { CollectionsEnum } from '../firebase/enums/collections.enum';
import { FirebaseService } from '../firebase/firebase-base.service';
import { FirebaseCrud } from '../firebase/interfaces/firebase-crud.interface';
import { AthleteDLService } from './athlete-dl.service';
import { LeagueGameDLModel } from './models/league-game-dl.model';
import { LeagueRosterAthleteDLModel } from './models/league-roster-athlete-dl.model';
import { LeagueWeekDLModel } from './models/league-week-dl.model';

@Injectable({ providedIn: 'root' })
export class LeagueSeasonDLService
  extends FirebaseService<LeagueWeekDLModel>
  implements FirebaseCrud<LeagueWeekDLModel>, OnDestroy
{
  seasonDL: Observable<Array<LeagueWeekDLModel>>;

  private _seasonDL = new BehaviorSubject<Array<LeagueWeekDLModel>>([]);

  private unsubscribe = new Subject<void>();

  constructor(
    private fastAPIService: FastAPIService,
    private athleteDLService: AthleteDLService,
    angularFirestore: AngularFirestore
  ) {
    super(angularFirestore);
    this.seasonDL = this._seasonDL.asObservable();
    // this.initializeSeasons();
  }
  initialize(): void {
    throw new Error('Method not implemented.');
  }

  addEntity(model: LeagueWeekDLModel): void {
    this.addWithNestedOBJ(model, CollectionsEnum.Season, false);
    this.getSeason(model.LeagueID);
  }

  addEntityNeedsID(model: LeagueWeekDLModel): void {
    // this.add(model, CollectionsEnum.Season, true);
    this.addWithNestedOBJ(model, CollectionsEnum.Season, true);
    this.getSeason(model.LeagueID);
  }

  deleteEntity(model: LeagueWeekDLModel): void {
    this.delete(model, CollectionsEnum.Season);
  }

  updateEntity(model: LeagueWeekDLModel): void {
    this.updateNestedOBJ(model, CollectionsEnum.Season);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unsubscribe.next();
  }

  createSeason(LeagueSeason: Array<LeagueWeekModel>): void {
    // console.log(LeagueSeason);
    LeagueSeason.forEach((x) => {
      const y: LeagueWeekDLModel = new LeagueWeekDLModel();
      y.ID = x.ID;
      y.LeagueID = x.LeagueID;
      y.Status = x.Status;
      y.Week = x.Week;
      y.Games = [];
      x.Games.forEach((z) => {
        const w: LeagueGameDLModel = new LeagueGameDLModel();
        w.ID = this.getNewID();
        w.AwayTeamPlayerID = z.AwayTeamPlayerID;
        w.AwayTeam = this.buildDLTeam(z.AwayTeam);
        w.HomeTeamPlayerID = z.HomeTeamPlayerID;
        w.HomeTeam = this.buildDLTeam(z.HomeTeam);
        w.WeekNumber = z.WeekNumber;
        y.Games.push(w);
      });
      this.addEntity(y);
    });
  }

  getSeason(leagueID: string): Promise<QuerySnapshot<any>> {
    // getSeason(leagueID: string): Promise<Array<LeagueWeekModel>> {
    // getSeason(leagueID: string): Promise<Array<LeagueWeekModel>> {
    return this.queryGroupSingleWhereConditionNoLimit(
      CollectionsEnum.Season,
      'LeagueID',
      '==',
      leagueID
    );
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
      if (!game.HomeTeam) {
        game.HomeTeam = [];
      }
      if (!game.AwayTeam) {
        game.AwayTeam = [];
      }

      game.HomeTeam.forEach((rosterAthlete) => {
        const rosterAthleteDL: LeagueRosterAthleteDLModel =
          new LeagueRosterAthleteDLModel();
        rosterAthleteDL.AthleteID = rosterAthlete.Athlete.AthleteID;
        rosterAthleteDL.PlayerID = rosterAthlete.Athlete.PlayerID ?? '';
        rosterAthleteDL.RosterBackup = rosterAthlete.RosterBackup;
        rosterAthleteDL.RosterPosition = rosterAthlete.RosterPosition;
        rosterAthleteDL.RosterThird = rosterAthlete.RosterThird;
        gameDL.HomeTeam.push(rosterAthleteDL);
      });
      game.AwayTeam.forEach((rosterAthlete) => {
        const rosterAthleteDL: LeagueRosterAthleteDLModel =
          new LeagueRosterAthleteDLModel();
        rosterAthleteDL.AthleteID = rosterAthlete.Athlete.AthleteID;
        rosterAthleteDL.PlayerID = rosterAthlete.Athlete.PlayerID ?? '';
        rosterAthleteDL.RosterBackup = rosterAthlete.RosterBackup;
        rosterAthleteDL.RosterPosition = rosterAthlete.RosterPosition;
        rosterAthleteDL.RosterThird = rosterAthlete.RosterThird;
        gameDL.AwayTeam.push(rosterAthleteDL);
      });

      weekDL.Games.push(gameDL);
    });
    weeks.push(weekDL);
    // this._seasonDL.next(weeks);
    this.updateEntity(weekDL);
  }

  updateWholeSeason(
    leagueType: SportEnum,
    season: Array<LeagueWeekModel>
  ): void {
    season.forEach((week) => {
      this.updateSeason(leagueType, week);
    });
  }

  buildSeason(
    seasonDL: Array<LeagueWeekDLModel>,
    leagueType: SportEnum,
    athletes: Array<LeagueAthleteModel>
  ): Array<LeagueWeekModel> {
    const season: Array<LeagueWeekModel> = [];
    seasonDL.forEach((weekDL) => {
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
        game.HomeTeam = this.buildBLTeam(leagueType, gameDL.HomeTeam, athletes);
        game.AwayTeamPlayerID = gameDL.AwayTeamPlayerID;
        game.AwayTeam = this.buildBLTeam(leagueType, gameDL.AwayTeam, athletes);
        week.Games.push(game);
      });
      season.push(week);
    });
    return season;
  }

  private buildBLTeam(
    leagueType: SportEnum,
    roster: Array<LeagueRosterAthleteDLModel>,
    athletes: Array<LeagueAthleteModel>
  ): Array<LeagueRosterAthleteModel> {
    const retRoster: Array<LeagueRosterAthleteModel> = [];
    // switch (leagueType) {
    //   case SportEnum.Baseball:
    //   case SportEnum.Basketball:
    //   case SportEnum.Football:
    //     roster.forEach((athlete) => {
    //       const rosterAthleteModel: LeagueRosterAthleteModel =
    //         new LeagueRosterAthleteModel();
    //       rosterAthleteModel.RosterBackup = athlete.RosterBackup;
    //       rosterAthleteModel.RosterPosition = athlete.RosterPosition;
    //       rosterAthleteModel.Athlete =
    //         athletes.find((x) => x.AthleteID === athlete.AthleteID) ??
    //         new LeagueAthleteModel();
    //       retRoster.push(rosterAthleteModel);
    //     });
    //     break;
    //   case SportEnum.Soccer:
    //   default:
    // }
    roster.forEach((athlete) => {
      const rosterAthleteModel: LeagueRosterAthleteModel =
        new LeagueRosterAthleteModel();
      rosterAthleteModel.RosterBackup = athlete.RosterBackup;
      rosterAthleteModel.RosterPosition = athlete.RosterPosition;
      rosterAthleteModel.RosterThird = athlete.RosterThird;
      rosterAthleteModel.Athlete =
        athletes.find((x) => x.AthleteID === athlete.AthleteID) ??
        new LeagueAthleteModel();
      retRoster.push(rosterAthleteModel);
    });
    return retRoster ?? [];
  }

  private buildDLTeam(
    roster: Array<LeagueRosterAthleteModel>
  ): Array<LeagueRosterAthleteDLModel> {
    const retRoster: Array<LeagueRosterAthleteDLModel> = [];
    if (roster) {
      roster.forEach((athlete) => {
        const rosterAthleteModel: LeagueRosterAthleteDLModel =
          new LeagueRosterAthleteDLModel();
        rosterAthleteModel.RosterBackup = athlete.RosterBackup;
        rosterAthleteModel.RosterPosition = athlete.RosterPosition;
        rosterAthleteModel.RosterThird = athlete.RosterThird;
        rosterAthleteModel.AthleteID = athlete.Athlete.AthleteID;
        new LeagueAthleteModel();
        retRoster.push(rosterAthleteModel);
      });
    }
    return retRoster ?? [];
  }
}
