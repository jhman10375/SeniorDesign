import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Subject } from 'rxjs';

import { LeaguePlayerModel } from '../../shared/models/league-player.model';
import { LeagueModel } from '../../shared/models/league.model';
import { AthleteService } from '../../shared/services/bl/athlete.service';
import { GeneralService } from '../../shared/services/bl/general-service.service';
import { LeagueService } from '../../shared/services/bl/league.service';
import { UserModel } from '../../shared/services/dl/models/user.model';
import { UserService } from '../../shared/services/dl/user.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  providers: [LeagueService, AthleteService, UserService],
  styleUrls: ['league.component.scss'],
  selector: 'league',
  templateUrl: 'league.component.html',
})
export class LeagueComponent implements OnInit, OnDestroy {
  isMobile: boolean = false;

  myTeam: LeaguePlayerModel | undefined;

  activeLeague: LeagueModel | undefined;

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

    this.activeLeague = this.leagueService.getLeague(this.currentId ?? '-1');
    const currentUser: UserModel | undefined = this.userService.currentUser;
    if (currentUser) {
      this.myTeam = this.activeLeague?.Players.find(
        (x) => x.ID === currentUser.ID
      );
    }
    this.hasDraftOccurred =
      (this.activeLeague?.DraftDate.getTime() ?? 0) < new Date().getTime();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  navigateTo(url: string, id: string = '-1'): void {
    if (url == 'team' || url == 'player') {
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
