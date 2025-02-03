import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LeaguePlayerModel } from '../../models/league-player.model';
import { SchoolModel } from '../../models/school.model';
import { SchoolService } from '../bl/school.service';
import { FastAPIService } from '../fastAPI/fast-api.service';
import { PlayerDLModel } from './models/player-dl.model';

@Injectable({ providedIn: 'root' })
export class PlayerDLService {
  players: Observable<Array<LeaguePlayerModel>>;

  playersDL: Observable<Array<PlayerDLModel>>;

  private _playersDL = new BehaviorSubject<Array<PlayerDLModel>>([]);

  private _players = new BehaviorSubject<Array<LeaguePlayerModel>>([]);

  constructor(
    private schoolService: SchoolService,
    private fastAPIService: FastAPIService
  ) {
    this.players = this._players.asObservable();
    this.playersDL = this._playersDL.asObservable();
    // this.initializePlayers();
    this.convertPlayers();
  }

  initializePlayers(schools: Array<SchoolModel>): void {
    const leaguePlayers: Array<LeaguePlayerModel> = [];
    const player: LeaguePlayerModel = new LeaguePlayerModel();

    player.ID = '0';
    player.PlayerID = '0';
    player.Name = 'Jordan Herman';
    player.DraftPickSortOrder = -1;
    player.TeamName = "Jordan's Allstars";
    player.DraftTeamPlayerIDs = [
      '4433971',
      '4688380',
      '4431196',
      '4610131',
      '4899046',
      '4429955',
      '5092232',
      '4431506',
    ];
    // player.School = this.schoolService.getSchool(
    //   SchoolNameEnum.UniversityOfCincinnati
    // );
    player.School = schools.find((x) => x.ID == '2132') ?? new SchoolModel();
    player.Logos = [
      'http://a.espncdn.com/i/teamlogos/ncaa/500/2132.png',
      'http://a.espncdn.com/i/teamlogos/ncaa/500-dark/2132.png',
    ];
    // this._players.next([...this._players.value, player]);
    leaguePlayers.push(player);

    const player2: LeaguePlayerModel = new LeaguePlayerModel();
    player2.ID = '1';
    player2.Name = 'Zach Herman';
    player2.DraftPickSortOrder = -1;
    player2.TeamName = "Zach's Rockstars";
    player2.DraftTeamPlayerIDs = ['0', '1'];
    // player2.School = this.schoolService.getSchool(
    //   SchoolNameEnum.OhioStateUniversity
    // );
    player2.School = schools.find((x) => x.ID == '195') ?? new SchoolModel();
    player2.Logos = [
      'http://a.espncdn.com/i/teamlogos/ncaa/500/195.png',
      'http://a.espncdn.com/i/teamlogos/ncaa/500-dark/195.png',
    ];
    // this._players.next([...this._players.value, player2]);
    leaguePlayers.push(player2);

    const player3: LeaguePlayerModel = new LeaguePlayerModel();
    player3.ID = '2';
    player3.Name = 'Adam Herman';
    player3.DraftPickSortOrder = -1;
    player3.TeamName = "Adam's Rockstars";
    player3.DraftTeamPlayerIDs = ['1'];
    // player3.School = this.schoolService.getSchool(
    //   SchoolNameEnum.OhioStateUniversity
    // );
    player3.School = schools.find((x) => x.ID == '2649') ?? new SchoolModel();
    player3.Logos = [
      'http://a.espncdn.com/i/teamlogos/ncaa/500/2649.png',
      'http://a.espncdn.com/i/teamlogos/ncaa/500-dark/2649.png',
    ];
    // this._players.next([...this._players.value, player3]);
    leaguePlayers.push(player3);

    this._players.next(leaguePlayers);
  }

  addPlayer(player: LeaguePlayerModel): void {
    const players: Array<LeaguePlayerModel> = [];
    this._players.next([...players, player]);
  }

  getPlayer(id: string): LeaguePlayerModel | undefined {
    const player = this._players.value.find((x) => x.ID === id);
    if (player) {
      return player;
    }
    return undefined;
  }

  getLeague(
    players: Array<string>,
    schools: Array<SchoolModel>
  ): Array<LeaguePlayerModel> {
    this.initializePlayers(schools);
    const playersForLeague: Array<LeaguePlayerModel> = [];
    players.forEach((player) => {
      const p = this._players.value.find((x) => x.ID == player);
      if (p && !playersForLeague.includes(p)) {
        playersForLeague.push(p);
      }
    });
    return playersForLeague;
  }

  convertPlayers(): void {}

  //Goal after conversion of players:
  // league.Players = [
  //     {
  //       ID: '0',
  //       Name: 'Jordan Herman',
  //       TeamName: "Jordan's Allstars",
  //       Team: [],
  //       TeamPlayerIDs: ['0'],
  //       School: this.schoolService.getSchool(
  //         SchoolNameEnum.UniversityOfCincinnati
  //       ),
  //     },
  //   ];
}
