import { Component, Input, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';

import { LeagueAthleteModel } from '../../../models/league-athlete.model';
import { LeaguePlayerModel } from '../../../models/league-player.model';
import { SchoolModel } from '../../../models/school.model';
import { NumberLogoComponent } from '../number-logo/number-logo.component';

@Component({
  standalone: true,
  imports: [NumberLogoComponent, AvatarModule, TagModule],
  selector: 'player-header',
  templateUrl: 'player-header.component.html',
})
export class PlayerHeaderComponent implements OnInit {
  @Input() player: LeagueAthleteModel | undefined = undefined;

  @Input() school: SchoolModel | undefined = undefined;

  @Input() draftModal: boolean = false;

  @Input() LeaguePlayer: LeaguePlayerModel;

  constructor() {}

  ngOnInit() {}
}
