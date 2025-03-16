import { Pipe, PipeTransform } from '@angular/core';

import { LeagueAthleteModel } from '../models/league-athlete.model';

@Pipe({
  name: 'getInQueuePlayerSearchPipe',
})
export class InQueuePlayerSearchPipe implements PipeTransform {
  transform(
    athlete: LeagueAthleteModel,
    queue: Array<LeagueAthleteModel>
  ): boolean {
    if (queue.find((x) => x.AthleteID === athlete.AthleteID)) {
      return true;
    } else {
      return false;
    }
  }
}
