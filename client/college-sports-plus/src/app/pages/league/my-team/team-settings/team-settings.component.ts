import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { BehaviorSubject, Observable, Subject, take, takeUntil } from 'rxjs';

import { LogoSelector } from '../../../../shared/components/shared/logo-selector/logo-selector.component';
import { LeaguePlayerModel } from '../../../../shared/models/league-player.model';
import { FastAPIService } from '../../../../shared/services/fastAPI/fast-api.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LogoSelector,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
  ],
  selector: 'team-settings',
  templateUrl: 'team-settings.component.html',
})
export class TeamSettingsComponent implements OnInit {
  teamForm: FormGroup;

  team: LeaguePlayerModel;

  valueChanged: Observable<boolean>;

  private _valueChanged = new BehaviorSubject<boolean>(false);

  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private fastAPIService: FastAPIService,
    private ref: DynamicDialogRef,
    private dialogService: DialogService
  ) {
    this.valueChanged = this._valueChanged.asObservable();
    const dialogInstance = this.dialogService.getInstance(this.ref);
    this.team = dialogInstance.data.team;
    this.teamForm = this.formBuilder.group({
      Logo: [this.team.Logos],
      TeamName: [this.team.TeamName],
      School: [this.team.School],
    });
    this.teamForm.updateValueAndValidity();
    this.teamForm.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (value) => {
        this._valueChanged.next(
          value?.School?.ID != this.team.School.ID ||
            value.TeamName != this.team.TeamName
        );
      },
    });
  }

  ngOnInit() {}

  getSchool(school: SelectItem): void {
    console.log(school);
    if (school) {
      this.fastAPIService
        .getTeamByID(school.title ?? '')
        .pipe(take(1))
        .subscribe({
          next: (school) => {
            this.teamForm.patchValue({ School: school });
          },
        });
    }
  }

  submit(): void {
    this.ref.close(this.teamForm.getRawValue());
  }
}
