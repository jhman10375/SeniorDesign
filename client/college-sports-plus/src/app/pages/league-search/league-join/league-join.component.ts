import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, take, takeUntil } from 'rxjs';

import { LogoSelector } from '../../../shared/components/shared/logo-selector/logo-selector.component';
import { LeaguePlayerModel } from '../../../shared/models/league-player.model';
import { UserService } from '../../../shared/services/bl/user.service';
import { FastAPIService } from '../../../shared/services/fastAPI/fast-api.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    LogoSelector,
  ],
  selector: 'league-join',
  templateUrl: 'league-join.component.html',
})
export class LeagueJoinComponent implements OnInit, OnDestroy {
  leagueJoinForm: FormGroup;

  team: LeaguePlayerModel = new LeaguePlayerModel();

  passcodeRequired: boolean = true;

  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private fastAPIService: FastAPIService,
    private userService: UserService
  ) {
    const dialogInstance = this.dialogService.getInstance(this.ref);
    this.passcodeRequired = dialogInstance.data.passcodeRequired;

    this.userService.CurrentUser.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (user) => {
        if (this.leagueJoinForm) {
          this.leagueJoinForm.patchValue({
            player: {
              Name: user.Name,
            },
          });
          this.leagueJoinForm.patchValue({
            player: {
              PlayerID: user.ID,
            },
          });
        } else {
          this.team.PlayerID = user.ID;
          this.team.Name = user.Name;
        }
      },
    });
  }

  ngOnInit() {
    this.leagueJoinForm = this.formBuilder.group({
      passcode: [null, this.passcodeRequired ? [Validators.required] : []],
      player: this.formBuilder.group({
        Logo: [null, Validators.required],
        TeamName: [
          this.team.TeamName,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(128),
          ],
        ],
        School: [this.team.School],
        Name: [this.team.Name],
        PlayerID: [this.team.PlayerID],
        LeagueID: [this.team.LeagueID],
      }),
    });
    this.leagueJoinForm.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  submit(): void {
    this.ref.close(this.leagueJoinForm.getRawValue());
  }

  getSchool(school: SelectItem): void {
    console.log(school);
    if (school) {
      this.fastAPIService
        .getTeamByID(school.title ?? '')
        .pipe(take(1))
        .subscribe({
          next: (school) => {
            this.leagueJoinForm.patchValue({ School: school });
          },
        });
    }
  }
}
