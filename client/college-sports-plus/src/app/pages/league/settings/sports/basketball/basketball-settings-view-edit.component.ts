import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

import { SeedingTypeEnum } from '../../../../../shared/enums/seeding-type.enum';
import { BasketballLeagueSettingsModel } from '../../../../../shared/models/basketball-league-settings/basketball-league-settings.model';
import { PipesModule } from '../../../../../shared/pipes/pipes.module';

@Component({
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule, PipesModule],
  selector: 'basketball-settings-view-edit',
  templateUrl: 'basketball-settings-view-edit.component.html',
})
export class BasketballSettingsViewEditComponent implements OnInit {
  // @Input() set leagueSettings(v: BasketballLeagueSettingsModel) {
  //   console.log(v);
  //   console.log(v.GeneralSettingsModel.Name);
  // }
  @Input() leagueSettings: BasketballLeagueSettingsModel;

  @Input() view: boolean = true;

  readonly SeedingTypeEnum = SeedingTypeEnum;

  constructor() {}

  ngOnInit() {}
}
