import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { SportEnum } from '../../../shared/enums/sport.enum';
import { LeagueAthleteModel } from '../../../shared/models/league-athlete.model';
import { LeaguePlayerModel } from '../../../shared/models/league-player.model';
import { LeagueModel } from '../../../shared/models/league.model';
import { AthleteService } from '../../../shared/services/bl/athlete.service';
import { GeneralService } from '../../../shared/services/bl/general-service.service';
import { LeagueService } from '../../../shared/services/bl/league.service';
import { DraftSelectionsComponent } from '../draft-hub/football-draft/draft-selections/draft-selections.component';
import { DraftSelectionModel } from '../draft-hub/football-draft/models/draft-selection.model';

@Component({
  standalone: true,
  imports: [RouterOutlet, DraftSelectionsComponent],
  selector: 'draft-results',
  templateUrl: 'draft-results.component.html',
})
export class DraftResultsComponent implements OnInit {
  isMobile: boolean = false;

  selections: WritableSignal<Array<DraftSelectionModel>> = signal([]);

  numberOfRounds: number = 0;

  leagueID: string;

  isAtParentRoute: boolean = false;

  private league: LeagueModel;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private athleteService: AthleteService,
    private leagueService: LeagueService
  ) {
    this.isMobile = GeneralService.isMobile();

    this.leagueID =
      this.activatedRoute.parent?.snapshot.params['leagueID'] ?? '';
    this.league =
      this.leagueService.getLeague(this.leagueID) ?? new LeagueModel();

    this.buildSelections();

    switch (this.league.LeagueType) {
      case SportEnum.Football:
        this.numberOfRounds = 24;
        break;
      case SportEnum.Baseball:
        this.numberOfRounds = 26;
        break;
      case SportEnum.Basketball:
        this.numberOfRounds = 16;
        break;
      case SportEnum.Soccer:
        this.numberOfRounds = 28;
        break;
      default:
        break;
    }
  }

  ngOnInit() {}

  buildSelections(): void {
    const selections: Array<DraftSelectionModel> = [];
    const players: Array<LeaguePlayerModel> = this.league.Players.sort(
      (a, b) => a.DraftPickSortOrder - b.DraftPickSortOrder
    );
    players.forEach((player) => {
      const selection: DraftSelectionModel = new DraftSelectionModel();
      selection.ID = player.ID;
      selection.Name = player.Name;
      selection.Players = this.athleteService.getAthletesByIDs(
        player.DraftTeamPlayerIDs,
        this.league.Athletes
      );
      selections.push(selection);
    });
    this.selections.set(selections);
  }

  navigateTo(athlete: LeagueAthleteModel): void {
    this.router.navigate(['player', athlete.AthleteID], {
      relativeTo: this.activatedRoute,
    });
  }

  checkIfAtParentRoute(): boolean {
    const currentUrl = this.router.url;
    const parentRoute = `/league/${this.leagueID}/draft-results`; // Construct the parent route dynamically

    // Check if the current URL is the parent route (i.e., /app/:id and not any child route)
    this.isAtParentRoute = currentUrl.length == parentRoute.length;

    return this.isAtParentRoute;
  }
}
