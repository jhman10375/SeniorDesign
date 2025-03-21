import { Pipe, PipeTransform } from '@angular/core';

import { LeagueModel } from '../models/league.model';

@Pipe({
  name: 'getTeamName',
})
export class TeamNamePipe implements PipeTransform {
  transform(teamID: string | undefined, league: LeagueModel): any {
    return league.Players.find((x) => x.ID === teamID)?.TeamName ?? 'Not Set';
  }
}
