import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';

import { BaseballPositionEnum } from '../../enums/position/baseball-position.enum';
import { BasketballPositionEnum } from '../../enums/position/basketball-position.enum';
import { FootballPositionEnum } from '../../enums/position/football-position.enum';
import { SoccerPositionEnum } from '../../enums/position/soccer-position.enum';
import { RosterPositionEnum } from '../../enums/roster-position.enum';
import { SportEnum } from '../../enums/sport.enum';
import { WeekStatusEnum } from '../../enums/week-status.enum';
import { CurrentUserModel } from '../../models/current-user.model';
import { FootballLeagueSettingsModel } from '../../models/football-league-settings/football-league-settings.model';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeaguePlayerModel } from '../../models/league-player.model';
import { LeagueRosterAthleteModel } from '../../models/league-roster-athlete.model';
import { LeagueScorboardModel } from '../../models/league-scoreboard.model';
import { LeagueSearchModel } from '../../models/league-search.model';
import { LeagueWeekModel } from '../../models/league-week.model';
import { LeagueModel } from '../../models/league.model';
import { SchoolModel } from '../../models/school.model';
import { LeagueDLService } from '../dl/league-dl.service';
import { LeagueDLModel } from '../dl/models/league-dl.model';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { AthleteService } from './athlete.service';
import { LoadingService } from './loading.service';
import { PlayerService } from './player.service';
import { SchoolService } from './school.service';
import { UserService } from './user.service';

@Injectable()
export class LeagueService implements OnDestroy {
  league: Observable<Array<LeagueModel>>;

  leagueScoreboard: Observable<Array<LeagueScorboardModel>>;

  leaguesForSearch: Observable<Array<LeagueSearchModel>>;

  private currentUser: CurrentUserModel = new CurrentUserModel();

  // private _league = new BehaviorSubject<Array<LeagueModel>>([]);

  private _leaguesForSearch = new BehaviorSubject<Array<LeagueSearchModel>>([]);

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
    private userService: UserService,
    private playerService: PlayerService
  ) {
    this.league = this.leagueDLService.league; // need to figure out if this is needed
    this.league.pipe(take(1)).subscribe({
      // need to figure out if this is needed
      next: (l) => this.leagueDLService._league.next(l),
    });
    // this.league = this._league.asObservable(); // need to figure out if this is needed
    this.leagueScoreboard = this._leagueScoreboard.asObservable();
    this.leaguesForSearch = this._leaguesForSearch.asObservable();

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

  generateID(): string {
    return this.leagueDLService.getNewID();
  }

  convertLeagues(
    leagueIDs: Array<string>,
    footballAthletes: Array<LeagueAthleteModel>,
    basketballAthletes: Array<LeagueAthleteModel>,
    baseballAthletes: Array<LeagueAthleteModel>,
    soccerAthletes: Array<LeagueAthleteModel>,
    schools: Array<SchoolModel>
  ): void {
    // this.leagueDLService.convertLeagues(athletes, schools);
    this.leagueDLService.convertLeagues2(
      leagueIDs,
      footballAthletes,
      basketballAthletes,
      baseballAthletes,
      soccerAthletes,
      schools
    );
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

            // (newScoreboard.CurrentRanking = 2),
            (newScoreboard.ID = league.ID),
              // (newScoreboard.Leader = 'John Smith'),
              (newScoreboard.Manager =
                league.Settings.GeneralSettingsModel.LeagueManager.Name),
              (newScoreboard.Name = league.Name),
              (newScoreboard.PrimaryColor = (
                league.Settings as FootballLeagueSettingsModel
              ).GeneralSettingsModel.PrimaryColor),
              (newScoreboard.SecondaryColor = (
                league.Settings as FootballLeagueSettingsModel
              ).GeneralSettingsModel.SecondaryColor),
              (newScoreboard.Sport = league.LeagueType),
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

          const seenScoreboard = new Set();
          const scoreBoardsFiltered: Array<LeagueScorboardModel> =
            scoreboards.filter((scoreboard) => {
              if (seenScoreboard.has(scoreboard.ID)) {
                return false;
              } else {
                seenScoreboard.add(scoreboard.ID);
                return true;
              }
            });

          this._leagueScoreboard.next(scoreBoardsFiltered);
          this.loadingService.setIsLoading(false);
        },
      });
  }

  addPlayerToLeague(leagueID: string, player: LeaguePlayerModel): void {
    this.leagueDLService.addPlayerToLeague(leagueID, player.ID);
    this.playerService.addPlayer(player);
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

  getLeaguesForSearch(lt: SportEnum): void {
    let l: Array<LeagueDLModel> = [];
    this.leagueDLService
      .getLeagueSearch(lt)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (league) => {
          l = league;
          const leagueUnfiltered = l.map((obj): LeagueSearchModel => {
            return {
              ID: obj.ID,
              Manager: new LeaguePlayerModel(),
              Name: obj.Name,
              DraftDate: obj.DraftDate,
              LeagueType: obj.LeagueType,
              CurrentPlayers: obj.PlayerIDs.length,
              MaxPlayers: obj.Settings.GSM.NOT,
              Settings: obj.Settings,
            };
          });
          const leagues = leagueUnfiltered.filter(
            (x) => x.LeagueType === Number(lt)
          );
          this._leaguesForSearch.next(leagues);
        },
      });
  }

  addAthleteToTeamFromDraft(
    leagueID: string,
    playerID: string,
    athlete: LeagueAthleteModel
  ): void {
    const league: LeagueModel | undefined = this.getLeague(leagueID);
    if (league) {
      const player = league.Players.find((x) => x.PlayerID === playerID);
      const teamID = player?.ID ?? '';
      if (player) {
        player.DraftTeamPlayerIDs.push(athlete.AthleteID);

        player.DraftRoster.push(
          this.updateNewRoster(league.LeagueType, player.DraftRoster, athlete)
        );
        this.playerService.updatePlayer(player);

        league.Season.forEach((week) => {
          if (week) {
            const game = week.Games.find(
              (g) =>
                g.AwayTeamPlayerID == teamID || g.HomeTeamPlayerID == teamID
            );
            if (game && game.AwayTeamPlayerID == teamID) {
              if (!game.AwayTeam) {
                game.AwayTeam = [];
              }
              const newPlayer: LeagueRosterAthleteModel = this.updateNewRoster(
                league.LeagueType,
                game.AwayTeam,
                athlete
              );
              game.AwayTeam.push(newPlayer);
            } else if (game && game.HomeTeamPlayerID == teamID) {
              if (!game.HomeTeam) {
                game.HomeTeam = [];
              }
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
        });
      }
      this.updateLeague(league);
    }
  }

  addAthleteToTeamFromTransferPortal(
    leagueID: string,
    playerID: string,
    athlete: LeagueAthleteModel
  ): void {
    const league: LeagueModel | undefined = this.getLeague(leagueID);
    if (league) {
      const player = league.Players.find((x) => x.PlayerID === playerID);
      const teamID = player?.ID ?? '';
      if (player) {
        league.Season.forEach((week) => {
          if (
            week.Status == WeekStatusEnum.Current ||
            week.Status == WeekStatusEnum.Future
          ) {
            const game = week.Games.find(
              (g) =>
                g.AwayTeamPlayerID == teamID || g.HomeTeamPlayerID == teamID
            );
            if (game && game.AwayTeamPlayerID == teamID) {
              if (!game.AwayTeam) {
                game.AwayTeam = [];
              }
              const newPlayer: LeagueRosterAthleteModel = this.updateNewRoster(
                league.LeagueType,
                game.AwayTeam,
                athlete
              );
              game.AwayTeam.push(newPlayer);
            } else if (game && game.HomeTeamPlayerID == teamID) {
              if (!game.HomeTeam) {
                game.HomeTeam = [];
              }
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
        });
      }
      this.updateLeague(league);
    }
  }

  setDraftComplete(
    leagueID: string,
    complete: boolean,
    league: LeagueModel
  ): void {
    this.leagueDLService.setDraftComplete(leagueID, complete);
    league.Season.forEach((week) => {
      this.updateSeason(league.LeagueType, week);
    });
  }

  updateSeason(leagueType: SportEnum, week: LeagueWeekModel): void {
    this.leagueDLService.updateSeason(leagueType, week);
  }

  updateTeam(
    leagueID: string,
    teamID: string,
    team: Array<LeagueRosterAthleteModel>
  ): void {
    this.leagueDLService.updateTeam(leagueID, teamID, team);
  }

  updateLeague(league: LeagueModel): void {
    const leagues: Array<LeagueModel> = this.leagueDLService._league.value;
    const leaguesFiltered = leagues.filter((x) => x.ID !== league.ID);
    leaguesFiltered.push(league);
    this.leagueDLService._league.next(leaguesFiltered);
    this.getLeaguesForSearch(league.LeagueType);
  }

  updatePlayer(player: LeaguePlayerModel): void {
    this.playerService.updatePlayer(player);
  }

  addLeague(league: LeagueModel): void {
    const leagues: Array<LeagueModel> = this.leagueDLService._league.value;
    leagues.push(league);
    league.Season.forEach((x) => (x.LeagueID = league.ID));
    this.leagueDLService.addSeason(league.Season);
    this.leagueDLService.createLeague(league);
    this.leagueDLService._league.next(leagues);
    this.initializeLeagueScoreBoards();
  }

  CheckAthleteOnTeam(
    leagueID: string,
    athleteID: string
  ): LeaguePlayerModel | undefined {
    const league: LeagueModel =
      this.leagueDLService._league.value.find((x) => x.ID == leagueID) ??
      new LeagueModel();
    let retVal: LeaguePlayerModel = new LeaguePlayerModel();
    league.Season.forEach((week) => {
      week.Games.forEach((game) => {
        if (game.AwayTeam.find((x) => x.Athlete.AthleteID == athleteID)) {
          retVal =
            league.Players.find((x) => x.ID == game.AwayTeamPlayerID) ??
            new LeaguePlayerModel();
        } else if (
          game.HomeTeam.find((x) => x.Athlete.AthleteID == athleteID)
        ) {
          retVal =
            league.Players.find((x) => x.ID == game.HomeTeamPlayerID) ??
            new LeaguePlayerModel();
        }
      });
    });

    if (retVal.ID.length > 0) {
      return retVal;
    } else {
      return undefined;
    }
  }

  // updatePlayerIDs(
  //   athletes: Array<LeagueAthleteModel>,
  //   league: LeagueModel
  // ): Array<LeagueAthleteModel> {
  //   const retVal: Array<LeagueAthleteModel> = [];
  //   const leagueAthletes: Array<LeagueAthleteModel> = [];

  //   leagueAthletes.forEach((athlete) => {
  //     athletes = athletes.filter((x) => x.AthleteID != athlete.AthleteID);
  //     retVal.push(athlete);
  //   });
  //   return retVal.concat(athletes);
  // }

  updateNewRosterFromID(
    leagueType: SportEnum,
    teamRoster: Array<LeagueRosterAthleteModel>,
    athleteID: string
  ): LeagueRosterAthleteModel {
    let athletes: Array<LeagueAthleteModel> = [];

    switch (leagueType) {
      case SportEnum.Baseball:
        athletes = this.athleteService.getBaseballPlayers();
        break;
      case SportEnum.Basketball:
        athletes = this.athleteService.getBasketballPlayers();
        break;
      case SportEnum.Football:
        athletes = this.athleteService.getFootballPlayers();
        break;
      case SportEnum.Soccer:
        athletes = this.athleteService.getSoccerPlayers();
        break;
    }
    const athlete = athletes.find((x) => x.AthleteID === athleteID);
    if (athlete) {
      return this.updateNewRoster(leagueType, teamRoster, athlete);
    } else {
      return new LeagueRosterAthleteModel();
    }
  }

  //#region test roster
  updateNewRoster(
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
        switch (athlete.Position) {
          case BaseballPositionEnum.P:
            const bsbPFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == BaseballPositionEnum.P &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!bsbPFS) {
              return rosterAthlete;
            } else {
              const bsbPSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == BaseballPositionEnum.P &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!bsbPSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case BaseballPositionEnum.C:
            const bsbCFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == BaseballPositionEnum.C &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!bsbCFS) {
              return rosterAthlete;
            } else {
              const bsbCSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == BaseballPositionEnum.C &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!bsbCSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case BaseballPositionEnum.INF:
            const bsbINFFS1 = teamRoster.find(
              (x) =>
                x.Athlete.Position == BaseballPositionEnum.INF &&
                x.RosterBackup == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!bsbINFFS1) {
              rosterAthlete.RosterBackup = false;
              return rosterAthlete;
            } else {
              const bsbINFFS2 = teamRoster.find(
                (x) =>
                  x.Athlete.Position == BaseballPositionEnum.INF &&
                  x.RosterBackup == true &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!bsbINFFS2) {
                rosterAthlete.RosterBackup = true;
                return rosterAthlete;
              } else {
                const bsbINFSS1 = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == BaseballPositionEnum.INF &&
                    x.RosterBackup == false &&
                    x.RosterPosition == RosterPositionEnum.SecondString
                );
                if (!bsbINFSS1) {
                  rosterAthlete.RosterPosition =
                    RosterPositionEnum.SecondString;
                  rosterAthlete.RosterBackup = false;
                  return rosterAthlete;
                } else {
                  const bsbINFSS2 = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == BaseballPositionEnum.INF &&
                      x.RosterBackup == true &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!bsbINFSS2) {
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
          case BaseballPositionEnum.OF:
            const bsbOFFS1 = teamRoster.find(
              (x) =>
                x.Athlete.Position == BaseballPositionEnum.OF &&
                x.RosterBackup == false &&
                x.RosterThird == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!bsbOFFS1) {
              rosterAthlete.RosterBackup = false;
              rosterAthlete.RosterThird = false;
              return rosterAthlete;
            } else {
              const bsbOFFS2 = teamRoster.find(
                (x) =>
                  x.Athlete.Position == BaseballPositionEnum.OF &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!bsbOFFS2) {
                rosterAthlete.RosterBackup = true;
                rosterAthlete.RosterThird = false;
                return rosterAthlete;
              } else {
                const bsbOFFS3 = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == BaseballPositionEnum.OF &&
                    x.RosterBackup == false &&
                    x.RosterThird == true &&
                    x.RosterPosition == RosterPositionEnum.FirstString
                );
                if (!bsbOFFS3) {
                  rosterAthlete.RosterBackup = false;
                  rosterAthlete.RosterThird = true;
                  return rosterAthlete;
                } else {
                  const bsbOFSS1 = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == BaseballPositionEnum.OF &&
                      x.RosterBackup == false &&
                      x.RosterThird == false &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!bsbOFSS1) {
                    rosterAthlete.RosterPosition =
                      RosterPositionEnum.SecondString;
                    rosterAthlete.RosterBackup = false;
                    rosterAthlete.RosterThird = false;
                    return rosterAthlete;
                  } else {
                    const bsbOFSS2 = teamRoster.find(
                      (x) =>
                        x.Athlete.Position == BaseballPositionEnum.OF &&
                        x.RosterBackup == true &&
                        x.RosterThird == false &&
                        x.RosterPosition == RosterPositionEnum.SecondString
                    );
                    if (!bsbOFSS2) {
                      rosterAthlete.RosterPosition =
                        RosterPositionEnum.SecondString;
                      rosterAthlete.RosterBackup = true;
                      rosterAthlete.RosterThird = false;
                      return rosterAthlete;
                    } else {
                      const bsbOFSS3 = teamRoster.find(
                        (x) =>
                          x.Athlete.Position == BaseballPositionEnum.OF &&
                          x.RosterBackup == false &&
                          x.RosterThird == true &&
                          x.RosterPosition == RosterPositionEnum.SecondString
                      );
                      if (!bsbOFSS3) {
                        rosterAthlete.RosterPosition =
                          RosterPositionEnum.SecondString;
                        rosterAthlete.RosterBackup = false;
                        rosterAthlete.RosterThird = true;
                        return rosterAthlete;
                      } else {
                        return this.setBenchPosition(athlete, teamRoster);
                      }
                    }
                  }
                }
              }
            }
          case BaseballPositionEnum.UT:
            const bsbUTFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == BaseballPositionEnum.UT &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!bsbUTFS) {
              return rosterAthlete;
            } else {
              const bsbUTSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == BaseballPositionEnum.UT &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!bsbUTSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case BaseballPositionEnum.B1:
            const bsbB1FS = teamRoster.find(
              (x) =>
                x.Athlete.Position == BaseballPositionEnum.B1 &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!bsbB1FS) {
              return rosterAthlete;
            } else {
              const bsbB1SS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == BaseballPositionEnum.B1 &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!bsbB1SS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case BaseballPositionEnum.B3:
            const bsbB3FS = teamRoster.find(
              (x) =>
                x.Athlete.Position == BaseballPositionEnum.B3 &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!bsbB3FS) {
              return rosterAthlete;
            } else {
              const bsbB3SS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == BaseballPositionEnum.B3 &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!bsbB3SS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
        }
        break;
      case SportEnum.Basketball:
        switch (athlete.Position) {
          case BasketballPositionEnum.Center:
            const bkbCFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == BasketballPositionEnum.Center &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!bkbCFS) {
              return rosterAthlete;
            } else {
              const bkbCSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == BasketballPositionEnum.Center &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!bkbCSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case BasketballPositionEnum.Forward:
            const bkbF1FS = teamRoster.find(
              (x) =>
                x.Athlete.Position == BasketballPositionEnum.Forward &&
                x.RosterBackup == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!bkbF1FS) {
              rosterAthlete.RosterBackup = false;
              return rosterAthlete;
            } else {
              const bkbF2FS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == BasketballPositionEnum.Forward &&
                  x.RosterBackup == true &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!bkbF2FS) {
                rosterAthlete.RosterBackup = true;
                return rosterAthlete;
              } else {
                const bkbF1SS = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == BasketballPositionEnum.Forward &&
                    x.RosterBackup == false &&
                    x.RosterPosition == RosterPositionEnum.SecondString
                );
                if (!bkbF1SS) {
                  rosterAthlete.RosterPosition =
                    RosterPositionEnum.SecondString;
                  rosterAthlete.RosterBackup = false;
                  return rosterAthlete;
                } else {
                  const bkbF2SS = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == BasketballPositionEnum.Forward &&
                      x.RosterBackup == true &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!bkbF2SS) {
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
          case BasketballPositionEnum.Guard:
            const bkbG1FS = teamRoster.find(
              (x) =>
                x.Athlete.Position == BasketballPositionEnum.Guard &&
                x.RosterBackup == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!bkbG1FS) {
              rosterAthlete.RosterBackup = false;
              return rosterAthlete;
            } else {
              const bkbG2FS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == BasketballPositionEnum.Guard &&
                  x.RosterBackup == true &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!bkbG2FS) {
                rosterAthlete.RosterBackup = true;
                return rosterAthlete;
              } else {
                const bkbG1SS = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == BasketballPositionEnum.Guard &&
                    x.RosterBackup == false &&
                    x.RosterPosition == RosterPositionEnum.SecondString
                );
                if (!bkbG1SS) {
                  rosterAthlete.RosterPosition =
                    RosterPositionEnum.SecondString;
                  rosterAthlete.RosterBackup = false;
                  return rosterAthlete;
                } else {
                  const bkbG2SS = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == BasketballPositionEnum.Guard &&
                      x.RosterBackup == true &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!bkbG2SS) {
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
        }
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
        switch (athlete.Position) {
          case SoccerPositionEnum.D:
            const sccD1FS = teamRoster.find(
              (x) =>
                x.Athlete.Position == SoccerPositionEnum.D &&
                x.RosterBackup == false &&
                x.RosterThird == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!sccD1FS) {
              rosterAthlete.RosterBackup = false;
              rosterAthlete.RosterThird = false;
              return rosterAthlete;
            } else {
              const sccD2FS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == SoccerPositionEnum.D &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!sccD2FS) {
                rosterAthlete.RosterBackup = true;
                rosterAthlete.RosterThird = false;
                return rosterAthlete;
              } else {
                const sccD3FS = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == SoccerPositionEnum.D &&
                    x.RosterBackup == false &&
                    x.RosterThird == true &&
                    x.RosterPosition == RosterPositionEnum.FirstString
                );
                if (!sccD3FS) {
                  rosterAthlete.RosterBackup = false;
                  rosterAthlete.RosterThird = true;
                  return rosterAthlete;
                } else {
                  const sccD1SS = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == SoccerPositionEnum.D &&
                      x.RosterBackup == false &&
                      x.RosterThird == false &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!sccD1SS) {
                    rosterAthlete.RosterPosition =
                      RosterPositionEnum.SecondString;
                    rosterAthlete.RosterBackup = false;
                    rosterAthlete.RosterThird = false;
                    return rosterAthlete;
                  } else {
                    const sccD2SS = teamRoster.find(
                      (x) =>
                        x.Athlete.Position == SoccerPositionEnum.D &&
                        x.RosterBackup == true &&
                        x.RosterThird == false &&
                        x.RosterPosition == RosterPositionEnum.SecondString
                    );
                    if (!sccD2SS) {
                      rosterAthlete.RosterPosition =
                        RosterPositionEnum.SecondString;
                      rosterAthlete.RosterBackup = true;
                      rosterAthlete.RosterThird = false;
                      return rosterAthlete;
                    } else {
                      const sccD3SS = teamRoster.find(
                        (x) =>
                          x.Athlete.Position == SoccerPositionEnum.D &&
                          x.RosterBackup == false &&
                          x.RosterThird == true &&
                          x.RosterPosition == RosterPositionEnum.SecondString
                      );
                      if (!sccD3SS) {
                        rosterAthlete.RosterPosition =
                          RosterPositionEnum.SecondString;
                        rosterAthlete.RosterBackup = false;
                        rosterAthlete.RosterThird = true;
                        return rosterAthlete;
                      } else {
                        return this.setBenchPosition(athlete, teamRoster);
                      }
                    }
                  }
                }
              }
            }
          case SoccerPositionEnum.MD:
            const sccMD1FS = teamRoster.find(
              (x) =>
                x.Athlete.Position == SoccerPositionEnum.MD &&
                x.RosterBackup == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!sccMD1FS) {
              rosterAthlete.RosterBackup = false;
              return rosterAthlete;
            } else {
              const sccMD2FS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == SoccerPositionEnum.MD &&
                  x.RosterBackup == true &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!sccMD2FS) {
                rosterAthlete.RosterBackup = true;
                return rosterAthlete;
              } else {
                const sccMD1SS = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == SoccerPositionEnum.MD &&
                    x.RosterBackup == false &&
                    x.RosterPosition == RosterPositionEnum.SecondString
                );
                if (!sccMD1SS) {
                  rosterAthlete.RosterPosition =
                    RosterPositionEnum.SecondString;
                  rosterAthlete.RosterBackup = false;
                  return rosterAthlete;
                } else {
                  const sccMD2SS = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == SoccerPositionEnum.MD &&
                      x.RosterBackup == true &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!sccMD2SS) {
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
          case SoccerPositionEnum.F:
            const sccF1FS = teamRoster.find(
              (x) =>
                x.Athlete.Position == SoccerPositionEnum.F &&
                x.RosterBackup == false &&
                x.RosterThird == false &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!sccF1FS) {
              rosterAthlete.RosterBackup = false;
              rosterAthlete.RosterThird = false;
              return rosterAthlete;
            } else {
              const sccF2FS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == SoccerPositionEnum.F &&
                  x.RosterBackup == true &&
                  x.RosterThird == false &&
                  x.RosterPosition == RosterPositionEnum.FirstString
              );
              if (!sccF2FS) {
                rosterAthlete.RosterBackup = true;
                rosterAthlete.RosterThird = false;
                return rosterAthlete;
              } else {
                const sccF3FS = teamRoster.find(
                  (x) =>
                    x.Athlete.Position == SoccerPositionEnum.F &&
                    x.RosterBackup == false &&
                    x.RosterThird == true &&
                    x.RosterPosition == RosterPositionEnum.FirstString
                );
                if (!sccF3FS) {
                  rosterAthlete.RosterBackup = false;
                  rosterAthlete.RosterThird = true;
                  return rosterAthlete;
                } else {
                  const sccF1SS = teamRoster.find(
                    (x) =>
                      x.Athlete.Position == SoccerPositionEnum.F &&
                      x.RosterBackup == false &&
                      x.RosterThird == false &&
                      x.RosterPosition == RosterPositionEnum.SecondString
                  );
                  if (!sccF1SS) {
                    rosterAthlete.RosterPosition =
                      RosterPositionEnum.SecondString;
                    rosterAthlete.RosterBackup = false;
                    rosterAthlete.RosterThird = false;
                    return rosterAthlete;
                  } else {
                    const sccF2SS = teamRoster.find(
                      (x) =>
                        x.Athlete.Position == SoccerPositionEnum.F &&
                        x.RosterBackup == true &&
                        x.RosterThird == false &&
                        x.RosterPosition == RosterPositionEnum.SecondString
                    );
                    if (!sccF2SS) {
                      rosterAthlete.RosterPosition =
                        RosterPositionEnum.SecondString;
                      rosterAthlete.RosterBackup = true;
                      rosterAthlete.RosterThird = false;
                      return rosterAthlete;
                    } else {
                      const sccF3SS = teamRoster.find(
                        (x) =>
                          x.Athlete.Position == SoccerPositionEnum.F &&
                          x.RosterBackup == false &&
                          x.RosterThird == true &&
                          x.RosterPosition == RosterPositionEnum.SecondString
                      );
                      if (!sccF3SS) {
                        rosterAthlete.RosterPosition =
                          RosterPositionEnum.SecondString;
                        rosterAthlete.RosterBackup = false;
                        rosterAthlete.RosterThird = true;
                        return rosterAthlete;
                      } else {
                        return this.setBenchPosition(athlete, teamRoster);
                      }
                    }
                  }
                }
              }
            }
          case SoccerPositionEnum.GK:
            const sccGKFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == SoccerPositionEnum.GK &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!sccGKFS) {
              return rosterAthlete;
            } else {
              const sccGKSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == SoccerPositionEnum.GK &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!sccGKSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case SoccerPositionEnum.FM:
            const sccFMFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == SoccerPositionEnum.FM &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!sccFMFS) {
              return rosterAthlete;
            } else {
              const sccFMSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == SoccerPositionEnum.FM &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!sccFMSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
          case SoccerPositionEnum.M:
            const sccMFS = teamRoster.find(
              (x) =>
                x.Athlete.Position == SoccerPositionEnum.M &&
                x.RosterPosition == RosterPositionEnum.FirstString
            );
            if (!sccMFS) {
              return rosterAthlete;
            } else {
              const sccMSS = teamRoster.find(
                (x) =>
                  x.Athlete.Position == SoccerPositionEnum.M &&
                  x.RosterPosition == RosterPositionEnum.SecondString
              );
              if (!sccMSS) {
                rosterAthlete.RosterPosition = RosterPositionEnum.SecondString;
                return rosterAthlete;
              } else {
                return this.setBenchPosition(athlete, teamRoster);
              }
            }
        }
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
