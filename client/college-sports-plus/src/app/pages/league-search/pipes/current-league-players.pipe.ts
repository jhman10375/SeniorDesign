import { Pipe, PipeTransform } from '@angular/core';

import { LeagueSearchModel } from '../../../shared/models/league-search.model';

@Pipe({
  name: 'currentLeaguePlayers',
  standalone: true,
})
export class CurrentLeaguePlayersPipe implements PipeTransform {
  transform(league: LeagueSearchModel): string {
    return `${league.CurrentPlayers}/${league.MaxPlayers} players joined`;
  }
}
