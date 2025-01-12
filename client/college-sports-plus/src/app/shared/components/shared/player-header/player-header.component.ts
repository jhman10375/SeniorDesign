import { Component, Input, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';

import { LeagueAthleteModel } from '../../../models/league-athlete.model';
import { SchoolModel } from '../../../models/school.model';
import { NumberLogoComponent } from '../number-logo/number-logo.component';

@Component({
  standalone: true,
  imports: [NumberLogoComponent, AvatarModule],
  selector: 'player-header',
  templateUrl: 'player-header.component.html',
})
export class PlayerHeaderComponent implements OnInit {
  @Input() player: LeagueAthleteModel | undefined = undefined;

  @Input() school: SchoolModel | undefined = undefined;

  @Input() draftModal: boolean = false;

  constructor() {}

  ngOnInit() {}
}
