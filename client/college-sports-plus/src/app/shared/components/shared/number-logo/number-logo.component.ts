import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { LeagueAthleteModel } from '../../../models/league-athlete.model';
import { SchoolModel } from '../../../models/school.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'number-logo',
  templateUrl: 'number-logo.component.html',
  styleUrls: ['number-logo.component.scss'],
})
export class NumberLogoComponent implements OnInit {
  @Input() player: LeagueAthleteModel | undefined = undefined;

  @Input() school: SchoolModel | undefined = undefined;

  constructor() {}

  ngOnInit() {}
}
