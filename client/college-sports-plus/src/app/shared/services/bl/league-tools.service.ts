import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { WeekStatusEnum } from '../../enums/week-status.enum';
import { LeagueGameModel } from '../../models/league-game.model';
import { LeagueWeekModel } from '../../models/league-week.model';
import { FastAPIService } from '../fastAPI/fast-api.service';

@Injectable({ providedIn: 'root' })
export class LeagueToolsService {
  constructor(private fastAPIService: FastAPIService) {}

  getLeagueSchedules(
    teamID: string,
    numTeams: number = 8,
    numWeeks: number = 10
  ): Observable<Array<LeagueWeekModel>> {
    return this.fastAPIService.getLeagueSchedule(numTeams, numWeeks).pipe(
      map((x) => {
        const retVal: Array<LeagueWeekModel> = [];
        x.forEach((week, index) => {
          const weekModel = new LeagueWeekModel();
          weekModel.Week = week.week_num;
          weekModel.Status =
            index == 0 ? WeekStatusEnum.Current : WeekStatusEnum.Future;
          const games: Array<LeagueGameModel> = [];
          week.week_matches.forEach((match) => {
            const game: LeagueGameModel = new LeagueGameModel();
            game.WeekNumber = weekModel.Week;
            game.HomeTeamPlayerID = match.home == '1' ? teamID : match.home;
            game.AwayTeamPlayerID = match.away == '1' ? teamID : match.away;
            games.push(game);
          });
          weekModel.Games = games;
          retVal.push(weekModel);
        });
        return retVal;
      })
    );
  }
}
