import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Stepper, StepperModule } from 'primeng/stepper';
import { Subject, Subscription, take, takeUntil } from 'rxjs';

import { LogoSelector } from '../../../../shared/components/shared/logo-selector/logo-selector.component';
import { DraftPickOrderTypeEnum } from '../../../../shared/enums/draft-pick-order-type.enum';
import { SeedingTypeEnum } from '../../../../shared/enums/seeding-type.enum';
import { SportEnum } from '../../../../shared/enums/sport.enum';
import { TieBreakerTypeEnum } from '../../../../shared/enums/tie-breaker-type.enum';
import { TransferPortalDeadlineTypeEnum } from '../../../../shared/enums/transfer-portal-deadline-type.enum';
import { FootballLeagueSettingsModel } from '../../../../shared/models/football-league-settings/football-league-settings.model';
import { LeaguePlayerModel } from '../../../../shared/models/league-player.model';
import { LeagueModel } from '../../../../shared/models/league.model';
import { GeneralService } from '../../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../../shared/services/bl/league.service';
import { PlayerService } from '../../../../shared/services/bl/player.service';
import { UserService } from '../../../../shared/services/bl/user.service';
import { FastAPIService } from '../../../../shared/services/fastAPI/fast-api.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StepperModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    InputSwitchModule,
    LogoSelector,
    ConfirmDialogModule,
    FloatLabelModule,
    DropdownModule,
    ColorPickerModule,
    CalendarModule,
  ],
  providers: [ConfirmationService],
  selector: 'new-football-league',
  templateUrl: 'new-football-league.component.html',
})
export class NewFootballLeagueComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  readonly SeedingTypeEnum = SeedingTypeEnum;

  @ViewChild('settingStepper') stepper!: Stepper;

  @ViewChild('PickOrderTypeDropdown') PickOrderTypeDropdown!: Dropdown;

  schools: Array<SelectItem> = [];

  minDate: Date = new Date();

  active: number = 0;

  formGroup: FormGroup;

  get conferenceFormArray(): FormArray {
    return this.formGroup
      .get('LeagueSettingsModel')
      ?.get('Conferences') as FormArray;
  }

  teamForm: FormGroup;

  team: LeaguePlayerModel = new LeaguePlayerModel();

  footballLeague: FootballLeagueSettingsModel =
    new FootballLeagueSettingsModel();

  draftTypes: Array<SelectItem> = [
    {
      label: 'Random Snake',
      value: DraftPickOrderTypeEnum.RandomSnake,
    },
    {
      label: 'Random Sequence',
      value: DraftPickOrderTypeEnum.RandomSequence,
    },
    {
      label: 'Custom Snake',
      value: DraftPickOrderTypeEnum.CustomSnake,
    },
    {
      label: 'Custom Sequence',
      value: DraftPickOrderTypeEnum.CustomSequence,
    },
    {
      label: 'Alphabetical Snake',
      value: DraftPickOrderTypeEnum.AlphabeticalSnake,
    },
    {
      label: 'Alphabetical Sequence',
      value: DraftPickOrderTypeEnum.AlphabeticalSequence,
    },
  ];

  tieBreakerTypes: Array<SelectItem> = [
    {
      label: 'Points For',
      value: TieBreakerTypeEnum.PointsFor,
    },
    {
      label: 'Points Against',
      value: TieBreakerTypeEnum.PointsAgainst,
    },
    {
      label: 'Combo',
      value: TieBreakerTypeEnum.Combo,
    },
  ];

  seedingTypes: Array<SelectItem> = [
    {
      label: 'Best Overall',
      value: SeedingTypeEnum.BestOverall,
    },
    {
      label: 'Best by Conference',
      value: SeedingTypeEnum.BestByConference,
    },
    {
      label: 'Manual',
      value: SeedingTypeEnum.Manual,
    },
  ];

  transferPortalDeadlineTypes: Array<SelectItem> = [
    {
      label: 'Individual Game Start',
      value: TransferPortalDeadlineTypeEnum.IndividualGameStart,
    },
    {
      label: 'Wednesday Night Prior to First Kickoff',
      value: TransferPortalDeadlineTypeEnum.WednesdayNight,
    },
  ];

  private publicLeague: Subscription;

  private numberOfTeams: Subscription;

  private seedingType: Subscription;

  private unsubscribe = new Subject<void>();

  constructor(
    private fb: NonNullableFormBuilder,
    private confirmationService: ConfirmationService,
    private fastAPIService: FastAPIService,
    private userService: UserService,
    // private angularFirestore: AngularFirestore,
    private leagueService: LeagueService,
    private playerService: PlayerService,
    private router: Router
  ) {
    console.log('hit');

    this.userService.CurrentUser.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (user) => {
        if (this.teamForm) {
          this.teamForm.patchValue({ Name: user.Name });
          this.teamForm.patchValue({ PlayerID: user.ID });
        } else {
          this.team.PlayerID = user.ID;
          this.team.Name = user.Name;
        }
      },
    });
  }

  ngOnInit() {
    this.team.LeagueID = GeneralService
      .GenerateID
      // this.angularFirestore
      ();
    this.buildTeamForm();
    this.buildFootballLeague();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  onCreateTeam(event: Event) {
    // console.log(this.teamForm.getRawValue() as LeaguePlayerModel);
    this.team = this.teamForm.getRawValue();
    console.log(this.team);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        'Are you sure that you want to proceed? You may edit your team later in the My Team Page',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        // nextStep.emit();
        this.stepper.updateActiveStep(event, 1);
        this.formGroup.patchValue({
          GeneralSettingsModel: {
            LeagueManager: this.team,
          },
        });
        this.playerService.addPlayer(this.team);
      },
      reject: () => {},
    });
  }

  goToLeague(): void {
    this.router.navigate([
      'league',
      (this.formGroup.getRawValue() as FootballLeagueSettingsModel).LeagueID,
    ]);
  }

  onSubmit(): void {
    if (!this.formGroup.disabled) {
      this.formGroup.disable();
      console.log(this.formGroup.getRawValue() as FootballLeagueSettingsModel);
      this.formGroup.updateValueAndValidity();
      const league: LeagueModel = new LeagueModel();
      league.Settings =
        this.formGroup.getRawValue() as FootballLeagueSettingsModel;
      league.ID = this.team.LeagueID;
      league.Name = league.Settings.GeneralSettingsModel.Name;
      league.LeagueType = SportEnum.Football;
      league.Manager = league.Settings.GeneralSettingsModel.LeagueManager;
      league.Players = [this.team];
      league.DraftDate = league.Settings.DraftSettingsModel.Date;
      league.Season = [];
      league.Athletes = [];
      this.leagueService.addLeague(league);
    }
  }

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

  unsubscribeGeneralSettingsModel(): void {
    this.publicLeague.unsubscribe();
    this.numberOfTeams.unsubscribe();
  }

  unsubscribeSeasonModel(): void {
    this.seedingType.unsubscribe();
  }

  enableGeneralSettingsModelValidation(): void {
    this.formGroup.get('GeneralSettingsModel')?.get('Name')?.markAsDirty();
    this.formGroup
      .get('GeneralSettingsModel')
      ?.get('Name')
      ?.updateValueAndValidity();

    this.formGroup
      .get('GeneralSettingsModel')
      ?.get('NumberOfTeams')
      ?.markAsDirty();
    this.formGroup
      .get('GeneralSettingsModel')
      ?.get('NumberOfTeams')
      ?.updateValueAndValidity();

    this.formGroup
      .get('GeneralSettingsModel')
      ?.get('PublicLeague')
      ?.markAsDirty();
    this.formGroup
      .get('GeneralSettingsModel')
      ?.get('PublicLeague')
      ?.updateValueAndValidity();

    this.formGroup
      .get('GeneralSettingsModel')
      ?.get('PrimaryColor')
      ?.markAsDirty();
    this.formGroup
      .get('GeneralSettingsModel')
      ?.get('PrimaryColor')
      ?.updateValueAndValidity();

    this.formGroup
      .get('GeneralSettingsModel')
      ?.get('SecondaryColor')
      ?.markAsDirty();
    this.formGroup
      .get('GeneralSettingsModel')
      ?.get('SecondaryColor')
      ?.updateValueAndValidity();

    this.formGroup.get('GeneralSettingsModel')?.get('Passcode')?.markAsDirty();
    this.formGroup
      .get('GeneralSettingsModel')
      ?.get('Passcode')
      ?.updateValueAndValidity();

    this.subscribeGeneralSettingsModel();
  }

  enableDraftSettingsModelValidation(): void {
    this.formGroup
      .get('DraftSettingsModel')
      ?.get('PickOrderType')
      ?.markAsDirty();
    this.formGroup
      .get('DraftSettingsModel')
      ?.get('PickOrderType')
      ?.updateValueAndValidity();

    this.formGroup
      .get('DraftSettingsModel')
      ?.get('SelectionTime')
      ?.markAsDirty();
    this.formGroup
      .get('DraftSettingsModel')
      ?.get('SelectionTime')
      ?.updateValueAndValidity();

    this.formGroup.get('DraftSettingsModel')?.get('Date')?.markAsDirty();
    this.formGroup
      .get('DraftSettingsModel')
      ?.get('Date')
      ?.updateValueAndValidity();

    this.formGroup
      .get('DraftSettingsModel')
      ?.get('IncludeBenchInDraft')
      ?.markAsDirty();
    this.formGroup
      .get('DraftSettingsModel')
      ?.get('IncludeBenchInDraft')
      ?.updateValueAndValidity();
  }

  enableLeagueSettingsModelValidation(): void {
    this.conferenceFormArray.controls.forEach((c) => {
      c.get('ConferenceName')?.markAsDirty();
      c.get('ConferenceName')?.updateValueAndValidity();
    });

    this.formGroup
      .get('LeagueSettingsModel')
      ?.get('NumberOfConferences')
      ?.markAsDirty();
    this.formGroup
      .get('LeagueSettingsModel')
      ?.get('NumberOfConferences')
      ?.updateValueAndValidity();

    this.formGroup
      .get('LeagueSettingsModel')
      ?.get('TransferPortalDeadline')
      ?.markAsDirty();
    this.formGroup
      .get('LeagueSettingsModel')
      ?.get('TransferPortalDeadline')
      ?.updateValueAndValidity();
  }

  enablePositionModelValidation(): void {
    this.formGroup.get('PositionModel')?.get('QBMax')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('QBMax')?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('RBMax')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('RBMax')?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('WRMax')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('WRMax')?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('TEMax')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('TEMax')?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('DSTMax')?.markAsDirty();
    this.formGroup
      .get('PositionModel')
      ?.get('DSTMax')
      ?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('KMax')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('KMax')?.updateValueAndValidity();
  }

  enableSeasonModelValidation(): void {
    this.formGroup
      .get('SeasonModel')
      ?.get('RegularSeasonSettings')
      ?.get('RegularSeasonStart')
      ?.markAsDirty();
    this.formGroup
      .get('SeasonModel')
      ?.get('RegularSeasonSettings')
      ?.get('RegularSeasonStart')
      ?.updateValueAndValidity();

    this.formGroup
      .get('SeasonModel')
      ?.get('RegularSeasonSettings')
      ?.get('WeeksPerGame')
      ?.markAsDirty();
    this.formGroup
      .get('SeasonModel')
      ?.get('RegularSeasonSettings')
      ?.get('WeeksPerGame')
      ?.updateValueAndValidity();

    this.formGroup
      .get('SeasonModel')
      ?.get('RegularSeasonSettings')
      ?.get('RegularSeasonGames')
      ?.markAsDirty();
    this.formGroup
      .get('SeasonModel')
      ?.get('RegularSeasonSettings')
      ?.get('RegularSeasonGames')
      ?.updateValueAndValidity();

    this.formGroup
      .get('SeasonModel')
      ?.get('RegularSeasonSettings')
      ?.get('HomeFieldAdvantage')
      ?.markAsDirty();
    this.formGroup
      .get('SeasonModel')
      ?.get('RegularSeasonSettings')
      ?.get('HomeFieldAdvantage')
      ?.updateValueAndValidity();

    this.formGroup
      .get('SeasonModel')
      ?.get('RegularSeasonSettings')
      ?.get('PointBenefit')
      ?.markAsDirty();
    this.formGroup
      .get('SeasonModel')
      ?.get('RegularSeasonSettings')
      ?.get('PointBenefit')
      ?.updateValueAndValidity();

    this.formGroup
      .get('SeasonModel')
      ?.get('PlayoffSeasonSettings')
      ?.get('PlayoffTeams')
      ?.markAsDirty();
    this.formGroup
      .get('SeasonModel')
      ?.get('PlayoffSeasonSettings')
      ?.get('PlayoffTeams')
      ?.updateValueAndValidity();

    this.formGroup
      .get('SeasonModel')
      ?.get('PlayoffSeasonSettings')
      ?.get('WeeksInSemifinalGame')
      ?.markAsDirty();
    this.formGroup
      .get('SeasonModel')
      ?.get('PlayoffSeasonSettings')
      ?.get('WeeksInSemifinalGame')
      ?.updateValueAndValidity();

    this.formGroup
      .get('SeasonModel')
      ?.get('PlayoffSeasonSettings')
      ?.get('WeeksInChampionshipGame')
      ?.markAsDirty();
    this.formGroup
      .get('SeasonModel')
      ?.get('PlayoffSeasonSettings')
      ?.get('WeeksInChampionshipGame')
      ?.updateValueAndValidity();

    this.formGroup
      .get('SeasonModel')
      ?.get('PlayoffSeasonSettings')
      ?.get('SeedingType')
      ?.markAsDirty();
    this.formGroup
      .get('SeasonModel')
      ?.get('PlayoffSeasonSettings')
      ?.get('SeedingType')
      ?.updateValueAndValidity();

    this.formGroup
      .get('SeasonModel')
      ?.get('PlayoffSeasonSettings')
      ?.get('TieBreakerType')
      ?.markAsDirty();
    this.formGroup
      .get('SeasonModel')
      ?.get('PlayoffSeasonSettings')
      ?.get('TieBreakerType')
      ?.updateValueAndValidity();

    this.subscribeSeasonModel();
  }

  private addConferenceToConferenceFormArray(): void {
    const formGroup = this.fb.group({
      ID: [],
      LeagueID: [],
      ConferenceName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(64),
        ],
      ],
    });
    this.conferenceFormArray.push(formGroup);
  }

  private emptyConferenceFormArray(): void {
    for (let i = 0; i < this.conferenceFormArray.length; i++) {
      this.conferenceFormArray.removeAt(i);
    }
  }

  private subscribeGeneralSettingsModel(): void {
    this.publicLeague =
      this.formGroup
        .get('GeneralSettingsModel')
        ?.get('PublicLeague')
        ?.valueChanges.subscribe({
          next: (v) => {
            if (v == false) {
              this.formGroup
                .get('GeneralSettingsModel')
                ?.get('Passcode')
                ?.addValidators([Validators.required]);
              this.formGroup
                .get('GeneralSettingsModel')
                ?.updateValueAndValidity();
            } else if (v == true) {
              this.formGroup
                .get('GeneralSettingsModel')
                ?.get('Passcode')
                ?.removeValidators([Validators.required]);
              this.formGroup
                .get('GeneralSettingsModel')
                ?.get('Passcode')
                ?.reset();
              this.formGroup
                .get('GeneralSettingsModel')
                ?.get('Passcode')
                ?.updateValueAndValidity();
            }
          },
        }) ?? new Subscription();

    this.numberOfTeams =
      this.formGroup
        .get('GeneralSettingsModel')
        ?.get('NumberOfTeams')
        ?.valueChanges.subscribe({
          next: (v) => {
            if (v <= 7) {
              this.formGroup
                .get('LeagueSettingsModel')
                ?.patchValue({ NumberOfConferences: 1 });
              this.formGroup
                .get('LeagueSettingsModel')
                ?.updateValueAndValidity();

              if (this.conferenceFormArray.length > 0) {
                this.emptyConferenceFormArray();
              }
              this.addConferenceToConferenceFormArray();
            } else if (v > 7 && v < 12) {
              this.formGroup
                .get('LeagueSettingsModel')
                ?.patchValue({ NumberOfConferences: 2 });
              this.formGroup
                .get('LeagueSettingsModel')
                ?.updateValueAndValidity();
              if (this.conferenceFormArray.length > 0) {
                this.emptyConferenceFormArray();
              }
              this.addConferenceToConferenceFormArray();
              this.addConferenceToConferenceFormArray();
            } else if (v >= 12) {
              this.formGroup
                .get('LeagueSettingsModel')
                ?.patchValue({ NumberOfConferences: 4 });
              this.formGroup
                .get('LeagueSettingsModel')
                ?.updateValueAndValidity();
              if (this.conferenceFormArray.length > 0) {
                this.emptyConferenceFormArray();
              }
              this.addConferenceToConferenceFormArray();
              this.addConferenceToConferenceFormArray();
              this.addConferenceToConferenceFormArray();
              this.addConferenceToConferenceFormArray();
            }
          },
        }) ?? new Subscription();
  }

  private subscribeSeasonModel(): void {
    this.seedingType =
      this.formGroup
        .get('SeasonModel')
        ?.get('PlayoffSeasonSettings')
        ?.get('SeedingType')
        ?.valueChanges.subscribe({
          next: (v) => {
            if (
              v == SeedingTypeEnum.BestByConference ||
              v == SeedingTypeEnum.BestOverall
            ) {
              this.formGroup
                .get('SeasonModel')
                ?.get('PlayoffSeasonSettings')
                ?.get('TieBreakerType')
                ?.addValidators([Validators.required]);
              this.formGroup
                .get('SeasonModel')
                ?.get('PlayoffSeasonSettings')
                ?.get('TieBreakerType')
                ?.updateValueAndValidity();
            } else if (v == false) {
              this.formGroup
                .get('SeasonModel')
                ?.get('PlayoffSeasonSettings')
                ?.get('TieBreakerType')
                ?.removeValidators([Validators.required]);
              this.formGroup
                .get('SeasonModel')
                ?.get('PlayoffSeasonSettings')
                ?.get('TieBreakerType')
                ?.reset();
              this.formGroup
                .get('SeasonModel')
                ?.get('PlayoffSeasonSettings')
                ?.get('TieBreakerType')
                ?.updateValueAndValidity();
            }
          },
        }) ?? new Subscription();
  }

  private buildTeamForm(): void {
    this.teamForm = this.fb.group({
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
    });
  }

  private buildFootballLeague(): void {
    this.formGroup = this.fb.group({
      ID: [GeneralService.GenerateID()],
      LeagueID: [this.team.LeagueID],
      GeneralSettingsModel: this.fb.group({
        Name: [
          this.footballLeague.GeneralSettingsModel.Name,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(64),
          ],
        ],
        NumberOfTeams: [
          this.footballLeague.GeneralSettingsModel.NumberOfTeams,
          [Validators.required, Validators.min(4), Validators.max(32)],
        ],
        LeagueManager: [this.footballLeague.GeneralSettingsModel.LeagueManager],
        PublicLeague: [
          this.footballLeague.GeneralSettingsModel.PublicLeague,
          [Validators.required],
        ],
        Passcode: [this.footballLeague.GeneralSettingsModel.Passcode],
        PrimaryColor: [
          this.footballLeague.GeneralSettingsModel.PrimaryColor,
          [Validators.required],
        ],
        SecondaryColor: [
          this.footballLeague.GeneralSettingsModel.SecondaryColor,
          [Validators.required],
        ],
      }),
      DraftSettingsModel: this.fb.group({
        PickOrderType: [
          DraftPickOrderTypeEnum.RandomSnake,
          [Validators.required],
        ],
        SelectionTime: [
          this.footballLeague.DraftSettingsModel.SelectionTime,
          [Validators.required, Validators.min(10), Validators.max(300)],
        ],
        Date: [
          this.footballLeague.DraftSettingsModel.Date,
          [Validators.required],
        ],
        IncludeBenchInDraft: [
          this.footballLeague.DraftSettingsModel.IncludeBenchInDraft,
          [Validators.required],
        ],
      }),
      LeagueSettingsModel: this.fb.group({
        Conferences: this.fb.array([
          this.fb.group({
            ID: [],
            LeagueID: [],
            ConferenceName: [
              '',
              [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(64),
              ],
            ],
          }),
        ]),
        NumberOfConferences: [
          this.footballLeague.LeagueSettingsModel.NumberOfConferences,
        ],
        TransferPortalDeadline: [
          this.footballLeague.LeagueSettingsModel.TransferPortalDeadline,
          [Validators.required],
        ],
      }),
      PositionModel: this.fb.group({
        QBMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(8)],
        ],
        RBMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(12)],
        ],
        WRMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(12)],
        ],
        TEMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(8)],
        ],
        DSTMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(8)],
        ],
        KMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(8)],
        ],
      }),
      SeasonModel: this.fb.group({
        RegularSeasonSettings: this.fb.group({
          RegularSeasonStart: [
            null,
            [Validators.required, Validators.min(1), Validators.max(8)],
          ],
          WeeksPerGame: [
            null,
            [Validators.required, Validators.min(1), Validators.max(4)],
          ],
          RegularSeasonGames: [
            null,
            [Validators.required, Validators.min(4), Validators.max(18)],
          ],
          HomeFieldAdvantage: [
            this.footballLeague.SeasonModel.RegularSeasonSettings
              .HomeFieldAdvantage,
            [Validators.required],
          ],
          PointBenefit: [0, [Validators.min(0), Validators.max(15)]],
        }),
        PlayoffSeasonSettings: this.fb.group({
          PlayoffTeams: [null, [Validators.required, Validators.min(2)]],
          WeeksInSemifinalGame: [
            null,
            [Validators.required, Validators.min(2)],
          ],
          WeeksInChampionshipGame: [
            null,
            [Validators.required, Validators.min(2)],
          ],
          SeedingType: [
            this.footballLeague.SeasonModel.PlayoffSeasonSettings.SeedingType,
            [Validators.required],
          ],
          TieBreakerType: [
            this.footballLeague.SeasonModel.PlayoffSeasonSettings
              .TieBreakerType,
          ],
        }),
      }),
    });
  }
}
