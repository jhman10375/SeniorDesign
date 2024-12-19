import { Component, Input, OnInit } from '@angular/core';

import { LeagueAthleteModel } from '../../../../shared/models/league-athlete.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'draft-my-selections',
  styleUrls: ['draft-my-selections.component.scss'],
  templateUrl: 'draft-my-selections.component.html',
})
export class DraftMySelectionsComponent implements OnInit {
  @Input() athletes: Array<LeagueAthleteModel> = [];

  constructor() {}

  ngOnInit() {}
}
