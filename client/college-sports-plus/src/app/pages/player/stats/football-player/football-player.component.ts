import { Component, Input, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';

import { FootballPlayerStatsModel } from '../../../../shared/models/stats/football-player-stats.model';

@Component({
  standalone: true,
  imports: [DividerModule],
  selector: 'football-player-stats',
  templateUrl: 'football-player.component.html',
})
export class FootballPlayerStatsComponent implements OnInit {
  @Input() player: FootballPlayerStatsModel;

  constructor() {}

  ngOnInit() {}
}
