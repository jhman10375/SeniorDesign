import { Pipe, PipeTransform } from '@angular/core';

import { LeagueSearchModel } from '../../../shared/models/league-search.model';

@Pipe({
  name: 'canJoinLeague',
  standalone: true,
})
export class CanJoinLeaguePipe implements PipeTransform {
  transform(
    value: any,
    currentLeagues: Array<string>,
    league: LeagueSearchModel
  ): boolean {
    if (
      !currentLeagues.includes(value) &&
      !(league.CurrentPlayers == league.MaxPlayers)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
