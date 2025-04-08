import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  DialogService,
  DynamicDialogComponent,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { OrderListModule } from 'primeng/orderlist';

import { LeagueRosterAthleteModel } from '../../../../shared/models/league-roster-athlete.model';
import { TransferDialogCloseTypeEnum } from '../enums/transfer-dialog-close-type.enum';

@Component({
  standalone: true,
  imports: [OrderListModule],
  selector: 'transfer-dialog',
  templateUrl: 'transfer-dialog.component.html',
})
export class TransferDialogComponent implements OnInit, OnDestroy {
  positionPlayers: Array<LeagueRosterAthleteModel>;

  originalPlayers: Array<LeagueRosterAthleteModel>;

  dialogInstance: DynamicDialogComponent;

  constructor(
    private ref: DynamicDialogRef,
    private dialogService: DialogService
  ) {
    this.dialogInstance = this.dialogService.getInstance(this.ref);
    this.positionPlayers = this.dialogInstance.data.team;
    this.originalPlayers = [...this.dialogInstance.data.originalTeam];
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.ref) {
      if (
        JSON.stringify(this.originalPlayers) ===
        JSON.stringify(this.positionPlayers)
      ) {
        this.ref.close({
          CloseType: TransferDialogCloseTypeEnum.NoChange,
        });
      } else {
        this.ref.close({
          CloseType: TransferDialogCloseTypeEnum.Reorder,
          Athletes: this.positionPlayers,
        });
      }
    }
  }

  onReorder(): void {
    console.log(this.positionPlayers);
  }

  onTransfer(athlete: LeagueRosterAthleteModel): void {
    console.log(athlete);
    if (athlete.Athlete && athlete.Athlete.AthleteID.length > 0) {
      this.ref.close({
        CloseType: TransferDialogCloseTypeEnum.Transfer,
        Athlete: athlete,
      });
    } else {
      this.ref.close({
        CloseType: TransferDialogCloseTypeEnum.NoChange,
      });
    }
  }
}
