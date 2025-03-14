import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

import { PlayerHeaderComponent } from '../../shared/components/shared/player-header/player-header.component';
import { LeagueAthleteModel } from '../../shared/models/league-athlete.model';
import { LeaguePlayerModel } from '../../shared/models/league-player.model';
import { SchoolModel } from '../../shared/models/school.model';
import { AthleteService } from '../../shared/services/bl/athlete.service';
import { GeneralService } from '../../shared/services/bl/general-service.service';
import { LeagueService } from '../../shared/services/bl/league.service';
import { SchoolService } from '../../shared/services/bl/school.service';
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

  leaguePlayer: LeaguePlayerModel | undefined = undefined;

  school: SchoolModel | undefined = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private athleteService: AthleteService,
    private leagueService: LeagueService,
    private schoolService: SchoolService,
    private router: Router
  ) {
    this.isMobile = GeneralService.isMobile();

    const currentID = this.activatedRoute.snapshot.params['playerID'];

    const urlTree = this.router.parseUrl(this.router.url);
    const segments = urlTree.root.children['primary']?.segments;
    const leagueID = segments[1].toString();

    if (currentID !== '-1') {
      this.athleteService
        .getAthleteByID(currentID)
        .pipe(take(1))
        .subscribe({
          next: (a: PlayerFAPIModel) => {
            const p = GeneralService.FastAPILeagueAthleteModelConverter(a);
            this.schoolService
              .getSchoolByName(p.Team)
              .pipe(take(1))
              .subscribe({
                next: (school) => {
                  if (school != null) {
                    this.school = school;
                  }
                  this.leaguePlayer = this.leagueService.CheckAthleteOnTeam(
                    leagueID,
                    currentID
                  );
                  if (this.leaguePlayer && p) {
                    p.PlayerID = this.leaguePlayer.ID;
                  }
                  this.player = p;
                  console.log(this.player);
                  console.log(school);
                },
              });
          },
          error: (e) => console.error(e),
        });
    }
    console.log(this.player);
  }

  ngOnInit() {}
}
