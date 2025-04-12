import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

import { SeedingTypeEnum } from '../../../../../shared/enums/seeding-type.enum';
import { FootballLeagueSettingsModel } from '../../../../../shared/models/football-league-settings/football-league-settings.model';
import { PipesModule } from '../../../../../shared/pipes/pipes.module';

@Component({
  standalone: true,
  imports: [CommonModule, CardModule, DividerModule, PipesModule, ButtonModule],
  selector: 'football-settings-view-edit',
  templateUrl: 'football-settings-view-edit.component.html',
})
export class FootballSettingsViewEditComponent implements OnInit {
  @Input() leagueSettings: FootballLeagueSettingsModel;

  @Input() view: boolean = true;

  @Input() canEdit: boolean = false;

  @Output() onEdit = new EventEmitter<boolean>();

  readonly SeedingTypeEnum = SeedingTypeEnum;

  constructor() {}

  ngOnInit() {}

  onEditChange(val: boolean): void {
    if (this.canEdit) {
      this.onEdit.emit(val);
    }
  }
}
