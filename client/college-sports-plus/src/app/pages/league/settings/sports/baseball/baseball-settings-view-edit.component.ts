import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

import { SeedingTypeEnum } from '../../../../../shared/enums/seeding-type.enum';
import { BaseballLeagueSettingsModel } from '../../../../../shared/models/baseball-league-settings/baseball-league-settings.model';
import { PipesModule } from '../../../../../shared/pipes/pipes.module';

@Component({
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule, PipesModule],
  selector: 'baseball-settings-view-edit',
  templateUrl: 'baseball-settings-view-edit.component.html',
})
export class BaseballSettingsViewEditComponent implements OnInit {
  // @Input() set leagueSettings(v: BasketballLeagueSettingsModel) {
  //   console.log(v);
  //   console.log(v.GeneralSettingsModel.Name);
  // }
  @Input() leagueSettings: BaseballLeagueSettingsModel;

  @Input() view: boolean = true;

  readonly SeedingTypeEnum = SeedingTypeEnum;

  constructor() {}

  ngOnInit() {}
}
