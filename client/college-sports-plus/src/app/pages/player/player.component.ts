import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

import { PlayerHeaderComponent } from '../../shared/components/shared/player-header/player-header.component';
import { LeagueAthleteModel } from '../../shared/models/league-athlete.model';
import { AthleteService } from '../../shared/services/bl/athlete.service';
import { GeneralService } from '../../shared/services/bl/general-service.service';
import { PlayerFAPIModel } from '../../shared/services/fastAPI/models/player-fapi.model';

@Component({
  standalone: true,
  imports: [PlayerHeaderComponent],
  providers: [AthleteService],
  selector: 'player',
  templateUrl: 'player.component.html',
})
export class PlayerComponent implements OnInit {
  isMobile: boolean = false;

  player: LeagueAthleteModel | undefined = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private athleteService: AthleteService
  ) {
    this.isMobile = GeneralService.isMobile();

    const currentID = this.activatedRoute.snapshot.params['playerID'];
    if (currentID !== '-1') {
      this.athleteService
        .getAthleteByID(currentID)
        .pipe(take(1))
        .subscribe({
          next: (a: PlayerFAPIModel) => {
            const p = GeneralService.FastAPILeagueAthleteModelConverter(a);
            this.player = p;
          },
          error: (e) => console.error(e),
        });
    }
    console.log(this.player);
  }

  ngOnInit() {}
}
