import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  Subject,
  take,
  takeUntil,
} from 'rxjs';

import { FootballPositionEnum } from '../../enums/position/football-position.enum';
import { RosterPositionEnum } from '../../enums/roster-position.enum';
import { SportEnum } from '../../enums/sport.enum';
import { WeekStatusEnum } from '../../enums/week-status.enum';
import { CurrentUserModel } from '../../models/current-user.model';
import { FootballLeagueSettingsModel } from '../../models/football-league-settings/football-league-settings.model';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';
import { LeagueScorboardModel } from '../../models/league-scoreboard.model';
import { LeagueSearchModel } from '../../models/league-search.model';
import { LeagueWeekModel } from '../../models/league-week.model';
import { LeagueModel } from '../../models/league.model';
import { SchoolModel } from '../../models/school.model';
import { LeagueDLService } from '../dl/league-dl.service';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { AthleteService } from './athlete.service';
import { LoadingService } from './loading.service';
import { SchoolService } from './school.service';
import { UserService } from './user.service';

@Injectable()
export class LeagueService implements OnDestroy {
  league: Observable<Array<LeagueModel>>;

  leagueScoreboard: Observable<Array<LeagueScorboardModel>>;

  private currentUser: CurrentUserModel = new CurrentUserModel();

  // private _league = new BehaviorSubject<Array<LeagueModel>>([]);

  private _leagueScoreboard = new BehaviorSubject<Array<LeagueScorboardModel>>(
    []
  );

  private unsubscribe = new Subject<void>();

  constructor(
    private schoolService: SchoolService,
    private leagueDLService: LeagueDLService,
    private athleteService: AthleteService,
    private loadingService: LoadingService,
    private fastAPIService: FastAPIService,
    private userService: UserService
  ) {
    this.league = this.leagueDLService.league; // need to figure out if this is needed
    this.league.pipe(take(1)).subscribe({
      // need to figure out if this is needed
      next: (l) => this.leagueDLService._league.next(l),
    });
    // this.league = this._league.asObservable(); // need to figure out if this is needed
    this.leagueScoreboard = this._leagueScoreboard.asObservable();

    this.league.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (league) => {
        this.initializeLeagueScoreBoards();
      },
    });

    this.userService.CurrentUser.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.initializeLeagueScoreBoards();
      },
    });
    // this.initializeLeagueScoreBoards();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  convertLeagues(
    athletes: Array<LeagueAthleteModel>,
    schools: Array<SchoolModel>
  ): void {
    this.leagueDLService.convertLeagues(athletes, schools);
    this.initializeLeagueScoreBoards();
  }

  initializeLeagueScoreBoards(): void {
    const scoreboards: Array<LeagueScorboardModel> = [];
    this.loadingService.setIsLoading(true);
    this.fastAPIService
      .getAllSchools()
      .pipe(take(1))
      .subscribe({
        next: (schools) => {
          this.leagueDLService._league.value?.forEach((league) => {
            const newScoreboard: LeagueScorboardModel =
              new LeagueScorboardModel();

            (newScoreboard.CurrentRanking = 2),
              (newScoreboard.ID = league.ID),
              (newScoreboard.Leader = 'John Smith'),
              (newScoreboard.Manager = 'John Smith'),
              (newScoreboard.Name = league.Name),
              (newScoreboard.PrimaryColor = (
                league.Settings as FootballLeagueSettingsModel
              ).GeneralSettingsModel.PrimaryColor),
              (newScoreboard.SecondaryColor = (
                league.Settings as FootballLeagueSettingsModel
              ).GeneralSettingsModel.SecondaryColor),
              (newScoreboard.Sport = SportEnum.Football),
              (newScoreboard.Team =
                league.Players.find((x) => x.PlayerID === this.currentUser.ID)
                  ?.TeamName ?? '');

            // newScoreboard.Manager = league.Manager.Name;
            // newScoreboard.Name = league.Name;
            // newScoreboard.Sport = league.LeagueType;
            // newScoreboard.Team =
            //   league.Players.find((p) => p.PlayerID === this.currentUser.ID)
            //     ?.Name ?? '';
            scoreboards.push(newScoreboard);
          });
          this._leagueScoreboard.next(scoreboards);
          this.loadingService.setIsLoading(false);
        },
      });

    // const scoreBoard: LeagueScorboardModel = new LeagueScorboardModel();
    // this.fastAPIService
    //   .getTeamByID('2132')
    //   .pipe(take(1))
    //   .subscribe({
    //     next: (t) => {
    //       (scoreBoard.CurrentRanking = 2),
    //         (scoreBoard.ID = '0'),
    //         (scoreBoard.Leader = 'John Smith'),
    //         (scoreBoard.Manager = 'John Smith'),
    //         (scoreBoard.Name = "Smith's League"),
    //         (scoreBoard.SchoolColors = t),
    //         (scoreBoard.Sport = SportEnum.Football),
    //         (scoreBoard.Team = "Jordan's Allstars");
    //       this._leagueScoreboard.next([scoreBoard]);
    //     },
    //   });

    // bottom should stay commented out

    // const ucSchoolColors: SchoolModel = this.schoolService.getSchool(
    //   SchoolNameEnum.UniversityOfCincinnati
    // );
    // const osuSchoolColors: SchoolModel = this.schoolService.getSchool(
    //   SchoolNameEnum.OhioStateUniversity
    // );
    // const oregonSchoolColors: SchoolModel = this.schoolService.getSchool(
    //   SchoolNameEnum.UniversityOfOregon
    // );
    // this._leagueScoreboard.next([
    //   {
    //     CurrentRanking: 2,
    //     ID: '0',
    //     Leader: 'John Smith',
    //     Manager: 'John Smith',
    //     Name: "Smith's League",
    //     SchoolColors: ucSchoolColors,
    //     Sport: SportEnum.Football,
    //     Team: "Jordan's Allstars",
    //   },
    //   {
    //     CurrentRanking: 2,
    //     ID: '12',
    //     Leader: 'John Smith',
    //     Manager: 'John Smith',
    //     Name: "Smith's League 2024",
    //     SchoolColors: ucSchoolColors,
    //     Sport: SportEnum.Football,
    //     Team: "Jane Smith's 9ers",
    //   },
    //   {
    //     CurrentRanking: 1,
    //     ID: '1',
    //     Leader: 'Jeff Smith',
    //     Manager: 'Jessica Smith',
    //     Name: "Jess's League 2024",
    //     SchoolColors: osuSchoolColors,
    //     Sport: SportEnum.Football,
    //     Team: "Jane Smith's DreamTeam",
    //   },
    //   {
    //     CurrentRanking: 5,
    //     ID: '2',
    //     Leader: 'Jack Smith',
    //     Manager: 'Joe Smith',
    //     Name: "Cincy's League 2024",
    //     SchoolColors: oregonSchoolColors,
    //     Sport: SportEnum.Football,
    //     Team: "Jane's Boys",
    //   },
    //   {
    //     CurrentRanking: 2,
    //     ID: '3',
    //     Leader: 'John Smith',
    //     Manager: 'John Smith',
    //     Name: "Smith's League 2024",
    //     SchoolColors: oregonSchoolColors,
    //     Sport: SportEnum.Baseball,
    //     Team: "Jane Smith's 9ers",
    //   },
    //   {
    //     CurrentRanking: 1,
    //     ID: '4',
    //     Leader: 'Jeff Smith',
    //     Manager: 'Jessica Smith',
    //     Name: "Jess's League 2024",
    //     SchoolColors: osuSchoolColors,
    //     Sport: SportEnum.Baseball,
    //     Team: "Jane Smith's DreamTeam",
    //   },
    //   {
    //     CurrentRanking: 5,
    //     ID: '5',
    //     Leader: 'Jack Smith',
    //     Manager: 'Joe Smith',
    //     Name: "Cincy's League 2024",
    //     SchoolColors: ucSchoolColors,
    //     Sport: SportEnum.Baseball,
    //     Team: "Jane's Boys",
    //   },
    //   {
    //     CurrentRanking: 2,
    //     ID: '6',
    //     Leader: 'John Smith',
    //     Manager: 'John Smith',
    //     Name: "Smith's League 2024",
    //     SchoolColors: oregonSchoolColors,
    //     Sport: SportEnum.Basketball,
    //     Team: "Jane Smith's 9ers",
    //   },
    //   {
    //     CurrentRanking: 1,
    //     ID: '7',
    //     Leader: 'Jeff Smith',
    //     Manager: 'Jessica Smith',
    //     Name: "Jess's League 2024",
    //     SchoolColors: osuSchoolColors,
    //     Sport: SportEnum.Basketball,
    //     Team: "Jane Smith's DreamTeam",
    //   },
    //   {
    //     CurrentRanking: 5,
    //     ID: '8',
    //     Leader: 'Jack Smith',
    //     Manager: 'Joe Smith',
    //     Name: "Cincy's League 2024",
    //     SchoolColors: ucSchoolColors,
    //     Sport: SportEnum.Basketball,
    //     Team: "Jane's Boys",
    //   },
    //   {
    //     CurrentRanking: 2,
    //     ID: '9',
    //     Leader: 'John Smith',
    //     Manager: 'John Smith',
    //     Name: "Smith's League 2024",
    //     SchoolColors: oregonSchoolColors,
    //     Sport: SportEnum.Soccer,
    //     Team: "Jane Smith's 9ers",
    //   },
    //   {
    //     CurrentRanking: 1,
    //     ID: '10',
    //     Leader: 'Jeff Smith',
    //     Manager: 'Jessica Smith',
    //     Name: "Jess's League 2024",
    //     SchoolColors: osuSchoolColors,
    //     Sport: SportEnum.Soccer,
    //     Team: "Jane Smith's DreamTeam",
    //   },
    //   {
    //     CurrentRanking: 5,
    //     ID: '11',
    //     Leader: 'Jack Smith',
    //     Manager: 'Joe Smith',
    //     Name: "Cincy's League 2024",
    //     SchoolColors: ucSchoolColors,
    //     Sport: SportEnum.Soccer,
    //     Team: "Jane's Boys",
    //   },
    // ]);
  }

  getLeagueTeam(
    leagueID: string,
    teamID: string
  ): Array<LeagueRosterAthleteModel> | undefined {
    this.loadingService.setIsLoading(true);
    const league = this.getLeague(leagueID);
    if (league) {
      const currentWeek = league.Season.find(
        (week) => week.Status == WeekStatusEnum.Current
      );
      const player = league.Players.find((x) => x.ID === teamID);
      if (currentWeek) {
        const game = currentWeek.Games.find(
          (games) =>
            games.AwayTeamPlayerID === teamID ||
            games.HomeTeamPlayerID === teamID
        );
        if (game && game.AwayTeamPlayerID == teamID) {
          this.loadingService.setIsLoading(false);
          return game.AwayTeam;
        } else if (game && game.HomeTeamPlayerID == teamID) {
          this.loadingService.setIsLoading(false);
          return game.HomeTeam;
        }
      }
      // const player = league.Players.find((x) => x.ID === teamID);
      // if (player) {
      //   const athletes: Array<LeagueAthleteModel> =
      //     this.athleteService.getTeam(player);
      // this.loadingService.setIsLoading(false);
      // return { player, athletes };
      // }
    }
    this.loadingService.setIsLoading(false);
    return undefined;
  }

  getLeagueType(leagueID: string): SportEnum | undefined {
    const league = this.getLeague(leagueID);
    return league?.LeagueType;
  }

  getLeague(leagueID: string): LeagueModel | undefined {
    const league = this.leagueDLService._league.value.find(
      (x) => x.ID === leagueID
    );
    return league;
  }

  getLeaguesForSearch(lt: Number): Observable<Array<LeagueSearchModel>> {
    let l: Array<LeagueModel> = [];
    this.leagueDLService.league.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (league) => (l = league),
    });

    const leagueUnfiltered = l.map((obj): LeagueSearchModel => {
      return {
        ID: obj.ID,
        Manager: obj.Manager,
        Name: obj.Name,
        DraftDate: obj.DraftDate,
        LeagueType: obj.LeagueType,
        CurrentPlayers: obj.Players.length,
        MaxPlayers: obj.Settings.GeneralSettingsModel.NumberOfTeams,
      };
    });
    const leagues = leagueUnfiltered.filter((x) => x.LeagueType === lt);
    return of(leagues);
  }

  addAthleteToTeamFromDraft(
    leagueID: string,
    playerID: string,
    athlete: LeagueAthleteModel
  ): void {
    const league: LeagueModel | undefined = this.getLeague(leagueID);
    if (league) {
      const player = league.Players.find((x) => x.ID === playerID);
      if (player) {
        player.DraftTeamPlayerIDs.push(athlete.AthleteID);

        player.DraftRoster.push(
          this.updateNewRoster(league.LeagueType, player.DraftRoster, athlete)
        );
        // player.DraftRoster = this.updateRoster(
        //   league.LeagueType,
        //   player.DraftRoster,
        //   athlete
        // );

        const week = league.Season.find((week) => week.Week == 1);
        if (week) {
          const game = week.Games.find(
            (g) =>
              g.AwayTeamPlayerID == playerID || g.HomeTeamPlayerID == playerID
          );
          if (game && game.AwayTeamPlayerID == playerID) {
            const newPlayer: LeagueRosterAthleteModel = this.updateNewRoster(
              league.LeagueType,
              game.HomeTeam,
              athlete
            );
            game.AwayTeam.push(newPlayer);
            // game.AwayTeam = this.updateRoster(
            //   league.LeagueType,
            //   game.AwayTeam,
            //   athlete
            // );
          } else if (game && game.HomeTeamPlayerID == playerID) {
            // game.HomeTeam = this.updateRoster(
            //   league.LeagueType,
            //   game.HomeTeam,
            //   athlete
            // );
            const newPlayer: LeagueRosterAthleteModel = this.updateNewRoster(
              league.LeagueType,
              game.HomeTeam,
              athlete
            );
            game.HomeTeam.push(newPlayer);
          }
          if (game) {
            this.updateSeason(league.LeagueType, week);
          }
        }
      }
      this.updateLeague(league);
    }
  }

  updateSeason(leagueType: SportEnum, week: LeagueWeekModel): void {
    this.leagueDLService.updateSeason(leagueType, week);
  }

  updateLeague(league: LeagueModel): void {
    const leagues: Array<LeagueModel> = this.leagueDLService._league.value;
    const leaguesFiltered = leagues.filter((x) => x.ID !== league.ID);
    leaguesFiltered.push(league);
    this.leagueDLService._league.next(leaguesFiltered);
    this.getLeaguesForSearch(league.LeagueType);
  }

  addLeague(league: LeagueModel): void {
    const leagues: Array<LeagueModel> = this.leagueDLService._league.value;
    leagues.push(league);
    this.leagueDLService._league.next(leagues);
    this.initializeLeagueScoreBoards();
  }

  // private updateRoster(
  //   leagueType: SportEnum,
  //   playerRoster:
  //     | BaseballRosterModel
  //     | BasketballRosterModel
  //     | FootballRosterModel
  //     | SoccerRosterModel,
  //   athlete: LeagueAthleteModel
  // ):
  //   | BaseballRosterModel
  //   | BasketballRosterModel
  //   | FootballRosterModel
  //   | SoccerRosterModel {
  //   switch (leagueType) {
  //     case SportEnum.Baseball:
  //       break;
  //     case SportEnum.Basketball:
  //       break;
  //     case SportEnum.Football:
  //       switch (athlete.Position) {
  //         case FootballPositionEnum.QB:
  //           if (
  //             (playerRoster as any as FootballRosterModel).FirstTeamQB ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).FirstTeamQB =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).SecondTeamQB ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).SecondTeamQB =
  //               athlete;
  //           } else {
  //             switch (this.undefinedRosterSpace(playerRoster)) {
  //               case 0:
  //                 playerRoster.Bench1 = athlete;
  //                 break;
  //               case 1:
  //                 playerRoster.Bench2 = athlete;
  //                 break;
  //               case 2:
  //                 playerRoster.Bench3 = athlete;
  //                 break;
  //               case 3:
  //                 playerRoster.Bench4 = athlete;
  //                 break;
  //               case 4:
  //                 playerRoster.Bench5 = athlete;
  //                 break;
  //               case 5:
  //                 playerRoster.Bench6 = athlete;
  //                 break;
  //             }
  //           }
  //           break;
  //         case FootballPositionEnum.WR:
  //           if (
  //             (playerRoster as any as FootballRosterModel).FirstTeamWR1 ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).FirstTeamWR1 =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).FirstTeamWR2 ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).FirstTeamWR2 =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).FirstTeamFLEX ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).FirstTeamFLEX =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).SecondTeamWR1 ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).SecondTeamWR1 =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).SecondTeamWR2 ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).SecondTeamWR2 =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).SecondTeamFLEX ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).SecondTeamFLEX =
  //               athlete;
  //           } else {
  //             switch (this.undefinedRosterSpace(playerRoster)) {
  //               case 0:
  //                 playerRoster.Bench1 = athlete;
  //                 break;
  //               case 1:
  //                 playerRoster.Bench2 = athlete;
  //                 break;
  //               case 2:
  //                 playerRoster.Bench3 = athlete;
  //                 break;
  //               case 3:
  //                 playerRoster.Bench4 = athlete;
  //                 break;
  //               case 4:
  //                 playerRoster.Bench5 = athlete;
  //                 break;
  //               case 5:
  //                 playerRoster.Bench6 = athlete;
  //                 break;
  //             }
  //           }
  //           break;
  //         case FootballPositionEnum.RB:
  //           if (
  //             (playerRoster as any as FootballRosterModel).FirstTeamRB1 ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).FirstTeamRB1 =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).FirstTeamRB2 ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).FirstTeamRB2 =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).FirstTeamFLEX ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).FirstTeamFLEX =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).SecondTeamRB1 ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).SecondTeamRB1 =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).SecondTeamRB2 ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).SecondTeamRB2 =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).SecondTeamFLEX ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).SecondTeamFLEX =
  //               athlete;
  //           } else {
  //             switch (this.undefinedRosterSpace(playerRoster)) {
  //               case 0:
  //                 playerRoster.Bench1 = athlete;
  //                 break;
  //               case 1:
  //                 playerRoster.Bench2 = athlete;
  //                 break;
  //               case 2:
  //                 playerRoster.Bench3 = athlete;
  //                 break;
  //               case 3:
  //                 playerRoster.Bench4 = athlete;
  //                 break;
  //               case 4:
  //                 playerRoster.Bench5 = athlete;
  //                 break;
  //               case 5:
  //                 playerRoster.Bench6 = athlete;
  //                 break;
  //             }
  //           }
  //           break;
  //         case FootballPositionEnum.TE:
  //           if (
  //             (playerRoster as any as FootballRosterModel).FirstTeamTE ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).FirstTeamTE =
  //               athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).SecondTeamTE ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).SecondTeamTE =
  //               athlete;
  //           } else {
  //             switch (this.undefinedRosterSpace(playerRoster)) {
  //               case 0:
  //                 playerRoster.Bench1 = athlete;
  //                 break;
  //               case 1:
  //                 playerRoster.Bench2 = athlete;
  //                 break;
  //               case 2:
  //                 playerRoster.Bench3 = athlete;
  //                 break;
  //               case 3:
  //                 playerRoster.Bench4 = athlete;
  //                 break;
  //               case 4:
  //                 playerRoster.Bench5 = athlete;
  //                 break;
  //               case 5:
  //                 playerRoster.Bench6 = athlete;
  //                 break;
  //             }
  //           }
  //           break;
  //         case FootballPositionEnum.P:
  //           if (
  //             (playerRoster as any as FootballRosterModel).FirstTeamK ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).FirstTeamK = athlete;
  //           } else if (
  //             (playerRoster as any as FootballRosterModel).SecondTeamK ==
  //             undefined
  //           ) {
  //             (playerRoster as any as FootballRosterModel).SecondTeamK =
  //               athlete;
  //           } else {
  //             switch (this.undefinedRosterSpace(playerRoster)) {
  //               case 0:
  //                 playerRoster.Bench1 = athlete;
  //                 break;
  //               case 1:
  //                 playerRoster.Bench2 = athlete;
  //                 break;
  //               case 2:
  //                 playerRoster.Bench3 = athlete;
  //                 break;
  //               case 3:
  //                 playerRoster.Bench4 = athlete;
  //                 break;
  //               case 4:
  //                 playerRoster.Bench5 = athlete;
  //                 break;
  //               case 5:
  //                 playerRoster.Bench6 = athlete;
  //                 break;
  //             }
  //           }
  //           break;
  //       }
  //       break;
  //     case SportEnum.Soccer:
  //       break;
  //   }
  //   return playerRoster;
  // }

  // private undefinedRosterSpace(
  //   roster:
  //     | BaseballRosterModel
  //     | BasketballRosterModel
  //     | FootballRosterModel
  //     | SoccerRosterModel
  // ): number {
  //   let rosterSpace: number = 0;
  //   if (roster.Bench1 == undefined) {
  //     rosterSpace = 0;
  //   } else if (roster.Bench2 == undefined) {
  //     rosterSpace = 1;
  //   } else if (roster.Bench3 == undefined) {
  //     rosterSpace = 2;
  //   } else if (roster.Bench4 == undefined) {
  //     rosterSpace = 3;
  //   } else if (roster.Bench5 == undefined) {
  //     rosterSpace = 4;
  //   } else if (roster.Bench6 == undefined) {
  //     rosterSpace = 5;
  //   }

  //   return rosterSpace;
  // }

  //#region test roster
  private updateNewRoster(
    leagueType: SportEnum,
    teamRoster: Array<LeagueRosterAthleteModel>,
    athlete: LeagueAthleteModel
  ): LeagueRosterAthleteModel {
    const rosterAthlete: LeagueRosterAthleteModel =
      new LeagueRosterAthleteModel();
    rosterAthlete.Athlete = athlete;
    rosterAthlete.RosterPosition = RosterPositionEnum.FirstString;
    switch (leagueType) {
      case SportEnum.Baseball:
        break;
      case SportEnum.Basketball:
        break;
      case SportEnum.Football:
        switch (athlete.Position) {
          case FootballPositionEnum.QB:
            const qbFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == FootballPositionEnum.QB &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!qbFS) {
              return rosterAthlete;
            } else {
              const qbSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == FootballPositionEnum.QB &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!qbSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case FootballPositionEnum.WR:
            const wrFS1 = teamRoster.find(
              (x) =>
                x.Athlete.Position == FootballPositionEnum.WR &&
                x.RosterBackup == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!wrFS1) {
              rosterAthlete.RosterBackup = false;
              return rosterAthlete;
            } else {
              const wrFS2 = teamRoster.find(
                (x) =>
                  x.Athlete.Position == FootballPositionEnum.WR &&
                  x.RosterBackup == true &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!wrFS2) {
                rosterAthlete.RosterBackup = true;
                return rosterAthlete;
              } else {
                const wrSS1 = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == FootballPositionEnum.WR &&
                    x.RosterBackup == false &&
                    x.RosterPosition == RosterPositionEnum.SecondString
                );
                if (!wrSS1) {
                  rosterAthlete.RosterPosition =
                    RosterPositionEnum.SecondString;
                  rosterAthlete.RosterBackup = false;
                  return rosterAthlete;
                } else {
                  const wrSS2 = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == FootballPositionEnum.WR &&
                      x.RosterBackup == true &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!wrSS2) {
                    rosterAthlete.RosterPosition =
                      RosterPositionEnum.SecondString;
                    rosterAthlete.RosterBackup = true;
                    return rosterAthlete;
                  } else {
                    return this.setBenchPosition(athlete, teamRoster);
                  }
                }
              }
            }
          case FootballPositionEnum.RB:
            const rbFS1 = teamRoster.find(
              (x) =>
                x.Athlete.Position == FootballPositionEnum.RB &&
                x.RosterBackup == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!rbFS1) {
              rosterAthlete.RosterBackup = false;
              return rosterAthlete;
            } else {
              const rbFS2 = teamRoster.find(
                (x) =>
                  x.Athlete.Position == FootballPositionEnum.RB &&
                  x.RosterBackup == true &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!rbFS2) {
                rosterAthlete.RosterBackup = true;
                return rosterAthlete;
              } else {
                const rbSS1 = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == FootballPositionEnum.RB &&
                    x.RosterBackup == false &&
                    x.RosterPosition == RosterPositionEnum.SecondString
                );
                if (!rbSS1) {
                  rosterAthlete.RosterPosition =
                    RosterPositionEnum.SecondString;
                  rosterAthlete.RosterBackup = false;
                  return rosterAthlete;
                } else {
                  const rbSS2 = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == FootballPositionEnum.RB &&
                      x.RosterBackup == true &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!rbSS2) {
                    rosterAthlete.RosterPosition =
                      RosterPositionEnum.SecondString;
                    rosterAthlete.RosterBackup = true;
                    return rosterAthlete;
                  } else {
                    return this.setBenchPosition(athlete, teamRoster);
                  }
                }
              }
            }
          case FootballPositionEnum.TE:
            const teFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == FootballPositionEnum.TE &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!teFS) {
              return rosterAthlete;
            } else {
              const teSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == FootballPositionEnum.TE &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!teSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case FootballPositionEnum.P:
            const pFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == FootballPositionEnum.P &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!pFS) {
              return rosterAthlete;
            } else {
              const pSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == FootballPositionEnum.P &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!pSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
        }
        break;
      case SportEnum.Soccer:
        break;
    }
    return rosterAthlete; //Should be able to remove once other sport types are added. Need to work out solution for too many of a player selected
  }

  private setBenchPosition(
    athlete: LeagueAthleteModel,
    teamRoster: Array<LeagueRosterAthleteModel>
  ): LeagueRosterAthleteModel {
    const rosterAthlete: LeagueRosterAthleteModel =
      new LeagueRosterAthleteModel();
    rosterAthlete.Athlete = athlete;
    const b1 = teamRoster.find(
      (x) => x.RosterPosition == RosterPositionEnum.B1
    );
    if (!b1) {
      rosterAthlete.RosterPosition = RosterPositionEnum.B1;
    } else {
      const b2 = teamRoster.find(
        (x) => x.RosterPosition == RosterPositionEnum.B2
      );
      if (!b2) {
        rosterAthlete.RosterPosition = RosterPositionEnum.B2;
      } else {
        const b3 = teamRoster.find(
          (x) => x.RosterPosition == RosterPositionEnum.B3
        );
        if (!b3) {
          rosterAthlete.RosterPosition = RosterPositionEnum.B3;
        } else {
          const b4 = teamRoster.find(
            (x) => x.RosterPosition == RosterPositionEnum.B4
          );
          if (!b4) {
            rosterAthlete.RosterPosition = RosterPositionEnum.B4;
          } else {
            const b5 = teamRoster.find(
              (x) => x.RosterPosition == RosterPositionEnum.B5
            );
            if (!b5) {
              rosterAthlete.RosterPosition = RosterPositionEnum.B5;
            } else {
              const b6 = teamRoster.find(
                (x) => x.RosterPosition == RosterPositionEnum.B6
              );
              if (!b6) {
                rosterAthlete.RosterPosition = RosterPositionEnum.B6;
              }
            }
          }
        }
      }
    }

    return rosterAthlete;
  }
  //#endregion
}
