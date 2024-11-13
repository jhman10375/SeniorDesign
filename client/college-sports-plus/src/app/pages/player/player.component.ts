import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NumberLogoComponent } from '../../shared/components/shared/number-logo/number-logo.component';
import { LeagueAthleteModel } from '../../shared/models/league-athlete.model';
import { AthleteService } from '../../shared/services/bl/athlete.service';
import { GeneralService } from '../../shared/services/bl/general-service.service';

@Component({
  standalone: true,
  imports: [NumberLogoComponent],
  providers: [AthleteService],
  styleUrls: ['player.component.scss'],
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
      this.player = this.athleteService.getPlayer(currentID);
    }
    console.log(this.player);
  }

  ngOnInit() {}
}
