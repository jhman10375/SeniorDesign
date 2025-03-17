import { Component, Input, OnInit } from '@angular/core';

import { SoccerPlayerStatsModel } from '../../../../shared/models/stats/soccer-player-stats.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'soccer-player-stats',
  templateUrl: 'soccer-player.component.html',
})
export class SoccerPlayerStatsComponent implements OnInit {
  @Input() player: SoccerPlayerStatsModel;

  constructor() {}

  ngOnInit() {}
}
