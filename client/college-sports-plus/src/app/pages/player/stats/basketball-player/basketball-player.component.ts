import { Component, Input, OnInit } from '@angular/core';

import { BasketballPlayerStatsModel } from '../../../../shared/models/stats/basketball-player-stats.model';

@Component({
  standalone: true,
  imports: [],
  selector: 'basketball-player-stats',
  templateUrl: 'basketball-player.component.html',
})
export class BasketballPlayerStatsComponent implements OnInit {
  @Input() player: BasketballPlayerStatsModel;

  constructor() {}

  ngOnInit() {}
}
