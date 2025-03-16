import { Component, Input, OnInit } from '@angular/core';

import { BaseballPlayerStatsModel } from '../../../../shared/models/stats/baseball-player-stats.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'baseball-player-stats',
  templateUrl: 'baseball-player.component.html',
})
export class BaseballPlayerStatsComponent implements OnInit {
  @Input() player: BaseballPlayerStatsModel;

  constructor() {}

  ngOnInit() {}
}
