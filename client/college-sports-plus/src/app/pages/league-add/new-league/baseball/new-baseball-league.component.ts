import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
import { BaseballLeagueSettingsModel } from '../../../../shared/models/baseball-league-settings/baseball-league-settings.model';
import { CurrentUserModel } from '../../../../shared/models/current-user.model';
import { LeaguePlayerModel } from '../../../../shared/models/league-player.model';
import { LeagueModel } from '../../../../shared/models/league.model';
import { AthleteService } from '../../../../shared/services/bl/athlete.service';
import { GeneralService } from '../../../../shared/services/bl/general-service.service';
import { LeagueToolsService } from '../../../../shared/services/bl/league-tools.service';
import { LeagueService } from '../../../../shared/services/bl/league.service';
import { LoadingService } from '../../../../shared/services/bl/loading.service';
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
  selector: 'new-baseball-league',
  templateUrl: 'new-baseball-league.component.html',
})
export class NewBaseballLeagueComponent
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

  baseballLeague: BaseballLeagueSettingsModel =
    new BaseballLeagueSettingsModel();

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

  private currentUser: CurrentUserModel;

  private publicLeague: Subscription;

  private numberOfTeams: Subscription;

  private seedingType: Subscription;

  private unsubscribe = new Subject<void>();

  constructor(
    private fb: NonNullableFormBuilder,
    private confirmationService: ConfirmationService,
    private fastAPIService: FastAPIService,
    private userService: UserService,
    private angularFirestore: AngularFirestore,
    private leagueService: LeagueService,
    private leagueToolsService: LeagueToolsService,
    private playerService: PlayerService,
    private athleteService: AthleteService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    console.log('hit');

    this.userService.CurrentUser.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (user) => {
        this.currentUser = user;
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
    this.team.LeagueID = this.angularFirestore.createId();
    this.buildTeamForm();
    this.buildBaseballLeague();
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
      (this.formGroup.getRawValue() as BaseballLeagueSettingsModel).LeagueID,
    ]);
  }

  onSubmit(): void {
    if (!this.formGroup.disabled) {
      this.formGroup.disable();
      console.log(this.formGroup.getRawValue() as BaseballLeagueSettingsModel);
      this.formGroup.updateValueAndValidity();
      this.loadingService.setIsLoading(true);
      // this.schoolsService.schools.pipe(skip(1), take(1)).subscribe({
      //   next: (schools) => {
      this.athleteService.players.pipe(take(1)).subscribe({
        next: (athletes) => {
          this.team.ConferenceID = this.conferenceFormArray.getRawValue()[0].ID;
          this.playerService;
          const league: LeagueModel = new LeagueModel();
          league.Settings =
            this.formGroup.getRawValue() as BaseballLeagueSettingsModel;
          league.ID = this.team.LeagueID;
          league.Name = (
            league.Settings as BaseballLeagueSettingsModel
          ).GeneralSettingsModel.Name;
          league.LeagueType = SportEnum.Baseball;
          league.Manager = (
            league.Settings as BaseballLeagueSettingsModel
          ).GeneralSettingsModel.LeagueManager;
          league.Players = [this.team];
          league.DraftDate = (
            league.Settings as BaseballLeagueSettingsModel
          ).DraftSettingsModel.Date;
          // league.Season = [];
          this.leagueToolsService
            .getLeagueSchedules(
              this.team.ID,
              (league.Settings as BaseballLeagueSettingsModel)
                .GeneralSettingsModel.NumberOfTeams,
              (league.Settings as BaseballLeagueSettingsModel).SeasonModel
                .RegularSeasonSettings.RegularSeasonGames
            )
            .pipe(take(1))
            .subscribe({
              next: (schedule) => {
                league.Season = schedule;
                league.Athletes = athletes;
                league.Season.forEach(
                  (x) => (x.ID = this.angularFirestore.createId())
                );
                this.currentUser.LeagueIDs = [
                  ...this.currentUser.LeagueIDs,
                  this.team.LeagueID,
                ];
                this.userService.updateCurrentUser(this.currentUser);
                this.leagueService.addLeague(league);
                this.loadingService.setIsLoading(false);
              },
            });
        },
      });
      //   },
      // });
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
    this.formGroup.get('PositionModel')?.get('PMax')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('PMax')?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('INFMax')?.markAsDirty();
    this.formGroup
      .get('PositionModel')
      ?.get('INFMax')
      ?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('CMax')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('CMax')?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('OFMax')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('OFMax')?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('UTMax')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('UTMax')?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('B3Max')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('B3Max')?.updateValueAndValidity();

    this.formGroup.get('PositionModel')?.get('B1Max')?.markAsDirty();
    this.formGroup.get('PositionModel')?.get('B1Max')?.updateValueAndValidity();
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
      ID: [GeneralService.GenerateID()],
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
      DraftTeamPlayerIDs: [this.team.DraftTeamPlayerIDs],
      DraftRoster: [this.team.DraftRoster],
      ID: [this.angularFirestore.createId()],
    });
  }

  private buildBaseballLeague(): void {
    this.formGroup = this.fb.group({
      ID: [GeneralService.GenerateID()],
      LeagueID: [this.team.LeagueID],
      GeneralSettingsModel: this.fb.group({
        Name: [
          this.baseballLeague.GeneralSettingsModel.Name,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(64),
          ],
        ],
        NumberOfTeams: [
          this.baseballLeague.GeneralSettingsModel.NumberOfTeams,
          [Validators.required, Validators.min(4), Validators.max(32)],
        ],
        LeagueManager: [this.baseballLeague.GeneralSettingsModel.LeagueManager],
        PublicLeague: [
          this.baseballLeague.GeneralSettingsModel.PublicLeague,
          [Validators.required],
        ],
        Passcode: [this.baseballLeague.GeneralSettingsModel.Passcode],
        PrimaryColor: [
          this.baseballLeague.GeneralSettingsModel.PrimaryColor,
          [Validators.required],
        ],
        SecondaryColor: [
          this.baseballLeague.GeneralSettingsModel.SecondaryColor,
          [Validators.required],
        ],
      }),
      DraftSettingsModel: this.fb.group({
        PickOrderType: [
          DraftPickOrderTypeEnum.RandomSnake,
          [Validators.required],
        ],
        SelectionTime: [
          this.baseballLeague.DraftSettingsModel.SelectionTime,
          [Validators.required, Validators.min(10), Validators.max(300)],
        ],
        Date: [
          this.baseballLeague.DraftSettingsModel.Date,
          [Validators.required],
        ],
        IncludeBenchInDraft: [
          this.baseballLeague.DraftSettingsModel.IncludeBenchInDraft,
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
          this.baseballLeague.LeagueSettingsModel.NumberOfConferences,
        ],
        TransferPortalDeadline: [
          this.baseballLeague.LeagueSettingsModel.TransferPortalDeadline,
          [Validators.required],
        ],
      }),
      PositionModel: this.fb.group({
        PMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(12)],
        ],
        INFMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(12)],
        ],
        CMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(8)],
        ],
        OFMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(12)],
        ],
        UTMax: [
          null,
          [Validators.required, Validators.min(1), Validators.max(12)],
        ],
        B3Max: [
          null,
          [Validators.required, Validators.min(1), Validators.max(8)],
        ],
        B1Max: [
          null,
          [Validators.required, Validators.min(1), Validators.max(12)],
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
            this.baseballLeague.SeasonModel.RegularSeasonSettings
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
            this.baseballLeague.SeasonModel.PlayoffSeasonSettings.SeedingType,
            [Validators.required],
          ],
          TieBreakerType: [
            this.baseballLeague.SeasonModel.PlayoffSeasonSettings
              .TieBreakerType,
          ],
        }),
      }),
    });
  }
}
