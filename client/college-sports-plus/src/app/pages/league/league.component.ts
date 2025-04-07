import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Button } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';

import { SportEnum } from '../../shared/enums/sport.enum';
import { CurrentUserModel } from '../../shared/models/current-user.model';
import { LeaguePlayerModel } from '../../shared/models/league-player.model';
import { LeagueModel } from '../../shared/models/league.model';
import { GeneralService } from '../../shared/services/bl/general-service.service';
import { LeagueService } from '../../shared/services/bl/league.service';
import { UserService } from '../../shared/services/bl/user.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, Button],
  providers: [],
  styleUrls: ['league.component.scss'],
  selector: 'league',
  templateUrl: 'league.component.html',
})
export class LeagueComponent implements OnInit, OnDestroy {
  readonly SportEnum = SportEnum;

  isMobile: boolean = false;

  myTeam: LeaguePlayerModel | undefined;

  activeLeague: LeagueModel | undefined;

  leagueType: SportEnum;

  isLeagueManager: boolean = false;

  isAtParentRoute: boolean = false;

  hasDraftOccurred: boolean = false;

  currentId: string | null = null;

  private unsubscribe = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private leagueService: LeagueService,
    private router: Router,
    private userService: UserService
  ) {
    this.isMobile = GeneralService.isMobile();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.currentId = params.get('leagueID');
    });

    this.leagueService.league.pipe(takeUntil(this.unsubscribe)).subscribe({
      next: (leagues) => {
        this.activeLeague = this.leagueService.getLeague(
          this.currentId ?? '-1'
        );
        const currentUser: CurrentUserModel | undefined =
          this.userService.getCurrentUser();
        if (currentUser) {
          this.myTeam = this.activeLeague?.Players.find(
            (x) => x.PlayerID === currentUser.ID
          );
        }

        this.hasDraftOccurred = this.activeLeague?.DraftComplete ?? false;
        // if (
        //   this.activeLeague?.Players.find(
        //     (x) => x.DraftTeamPlayerIDs && x.DraftTeamPlayerIDs.length > 0 // need to find a way to update this for if draft complete (how to mark complete?)
        //   )
        // ) {
        //   this.hasDraftOccurred = true;
        // } else {
        //   this.hasDraftOccurred = false;
        // }
        // this.hasDraftOccurred =
        //   (this.activeLeague?.DraftDate.getTime() ?? 0) < new Date().getTime();

        if (this.myTeam?.ID === this.activeLeague?.Manager?.ID) {
          this.isLeagueManager = true;
        } else {
          this.isLeagueManager = false;
        }

        this.leagueType = this.activeLeague?.LeagueType ?? SportEnum.Football;
      },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  navigateTo(url: string, id: string = '-1'): void {
    if (
      url == 'team' ||
      url == 'player' ||
      url == 'current-games' ||
      url == 'history'
    ) {
      this.router.navigate([url, id], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate([url], { relativeTo: this.activatedRoute });
    }
  }

  checkIfAtParentRoute(): boolean {
    const currentUrl = this.router.url;
    const parentRoute = `/league/${this.currentId}`; // Construct the parent route dynamically

    // Check if the current URL is the parent route (i.e., /app/:id and not any child route)
    this.isAtParentRoute = currentUrl.length == parentRoute.length;

    return this.isAtParentRoute;
  }

  goBack(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    // console.log(
    //   urlTree.root.children['primary'].segments
    //     .map((segment) => segment.path)
    //     .join('/')
    // );

    const segments = urlTree.root.children['primary']?.segments;
    const playerSearch = segments.find((x) => x.path == 'player-search');
    const draftResults = segments.find((x) => x.path == 'draft-results');
    const pastGame = segments.find((x) => x.path == 'past-game');
    const player = segments.find((x) => x.path == 'player');

    if (playerSearch && player) {
      this.router.navigate([playerSearch.path], {
        relativeTo: this.activatedRoute,
      });
    } else if (draftResults && player) {
      this.router.navigate([draftResults.path], {
        relativeTo: this.activatedRoute,
      });
    } else if (pastGame && player) {
      const updatedSegments = segments.slice(0, -2);
      const newPath = updatedSegments.map((segment) => segment.path).join('/');
      this.router.navigateByUrl(`/${newPath}`);
    } else {
      if (segments && segments.length > 4) {
        const id = segments[segments.length - 3].path;
        const path = segments[segments.length - 4].path;
        this.router.navigate([path, id], {
          relativeTo: this.activatedRoute,
        });
      } else if (segments && segments.length > 3) {
        const id = segments[segments.length - 3].path;
        const path = segments[segments.length - 4].path;
        this.router.navigate([path, id]);
      } else if (segments && segments.length > 2) {
        const id = segments[segments.length - 2].path;
        const path = segments[segments.length - 3].path;
        this.router.navigate([path, id]);
      }
    }
  }
}
