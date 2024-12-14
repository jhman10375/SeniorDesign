import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SchoolNameEnum } from '../../enums/school-name.enum';
import { LeagueAthleteModel } from '../../models/league-athlete.model';
import { LeaguePlayerModel } from '../../models/league-player.model';
import { LeagueModel } from '../../models/league.model';
import { SchoolService } from '../bl/school.service';

@Injectable({ providedIn: 'root' })
export class AthleteDLService {
  players: Observable<Array<LeagueAthleteModel>>;

  private _players = new BehaviorSubject<Array<LeagueAthleteModel>>([]);

  constructor(private schoolService: SchoolService) {
    this.players = this._players.asObservable();
    this.initializeAthletes();
    this.loadAthletes();
  }

  initializeAthletes(): void {
    const players: Array<LeagueAthleteModel> = [];
    const johnSmith: LeagueAthleteModel = new LeagueAthleteModel();
    johnSmith.AthleteID = '0';
    johnSmith.Name = 'John Smith';
    johnSmith.Number = '55';
    johnSmith.School = this.schoolService.getSchool(
      SchoolNameEnum.OhioStateUniversity
    );
    players.push(johnSmith);

    const geneSmith: LeagueAthleteModel = new LeagueAthleteModel();
    geneSmith.AthleteID = '1';
    geneSmith.Name = 'Gene Smith';
    geneSmith.Number = '1';
    geneSmith.School = this.schoolService.getSchool(
      SchoolNameEnum.UniversityOfCincinnati
    );
    players.push(geneSmith);

    this._players.next(players);
  }

  initializeLeagueAthletes(league: LeagueModel): Array<LeagueAthleteModel> {
    const leagueAthletes: Array<LeagueAthleteModel> = this.getAllAthletes();
    league.Players.forEach((x) => {
      x.TeamPlayerIDs.forEach((y) => {
        const athlete = leagueAthletes.find((z) => z.AthleteID === y);
        if (athlete) {
          athlete.PlayerID = x.ID;
        }
      });
    });
    return leagueAthletes;
  }

  getAllAthletes(): Array<LeagueAthleteModel> {
    return this._players.value;
  }

  getTeam(
    leagueAthletes: Array<LeagueAthleteModel>,
    leaguePlayer: LeaguePlayerModel
  ): Array<LeagueAthleteModel> {
    const athletes: Array<LeagueAthleteModel> = [];
    leaguePlayer.TeamPlayerIDs.forEach((x) => {
      const player = leagueAthletes.find((p) => p.AthleteID === x);
      if (player) {
        athletes.push(player);
      }
    });
    return athletes;
  }

  loadAthletes(): void {
    const players: Array<LeagueAthleteModel> = [];
    const johnSmith: LeagueAthleteModel = new LeagueAthleteModel();
    johnSmith.AthleteID = '0';
    johnSmith.Name = 'John Smith';
    johnSmith.Number = '55';
    johnSmith.School = this.schoolService.getSchool(
      SchoolNameEnum.OhioStateUniversity
    );
    players.push(johnSmith);

    const geneSmith: LeagueAthleteModel = new LeagueAthleteModel();
    geneSmith.AthleteID = '1';
    geneSmith.Name = 'Gene Smith';
    geneSmith.Number = '1';
    geneSmith.School = this.schoolService.getSchool(
      SchoolNameEnum.UniversityOfCincinnati
    );
    players.push(geneSmith);

    this._players.next(players);
  }
}
