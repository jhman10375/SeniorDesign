import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';
import { SchoolModel } from '../../../../shared/models/school.model';
import { SchoolService } from '../../../../shared/services/bl/school.service';
import { DraftPlayerWSModel } from './draft-player-ws.model';

export class DraftPlayerModel {
  Athlete: LeagueAthleteModel;

  constructor(private schoolService: SchoolService) {
    this.Athlete = new LeagueAthleteModel();
  }

  setDraftPlayer(p: DraftPlayerWSModel): void {
    const school: SchoolModel | undefined = this.schoolService.schools.find(
      (x) => x.ID === p.school.id
    );

    this.Athlete.AthleteID = p.id;
    this.Athlete.Name = p.name;
    this.Athlete.Number = p.number;
    this.Athlete.PlayerID = p.player_id;
    this.Athlete.School = school ?? new SchoolModel();
  }
}
