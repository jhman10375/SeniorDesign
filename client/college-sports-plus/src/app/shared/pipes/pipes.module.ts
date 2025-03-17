import { NgModule } from '@angular/core';

import { LeagueTypePipe } from '../pipes/get-league-type.pipe';
import { DraftOrderTypeTypePipe } from './get-draft-order-type.pipe';
import { HeightPipe } from './get-height.pipe';
import { InQueuePlayerSearchPipe } from './get-in-queue-player-search.pipe';
import { PlayoffSeedingTypePipe } from './get-playoff-seeding-type.pipe';
import { PlayoffTieBreakerTypePipe } from './get-playoff-tie-breaker-type.pipe';
import { TransferPortalDeadlineTypePipe } from './get-transfer-portal-deadline-type-pipe.pipe';
import { FootballRosterPlayerPipe } from './roster-pipes/football-roster-player.pipe';
import { FootballRosterPositionPipe } from './roster-pipes/football-roster-position.pipe';
import { TeamNamePipe } from './team-name.pipe';

@NgModule({
  imports: [],
  exports: [
    LeagueTypePipe,
    DraftOrderTypeTypePipe,
    PlayoffSeedingTypePipe,
    PlayoffTieBreakerTypePipe,
    TransferPortalDeadlineTypePipe,
    TeamNamePipe,
    FootballRosterPlayerPipe,
    FootballRosterPositionPipe,
    InQueuePlayerSearchPipe,
    HeightPipe,
  ],
  declarations: [
    LeagueTypePipe,
    DraftOrderTypeTypePipe,
    PlayoffSeedingTypePipe,
    PlayoffTieBreakerTypePipe,
    TransferPortalDeadlineTypePipe,
    TeamNamePipe,
    FootballRosterPlayerPipe,
    FootballRosterPositionPipe,
    InQueuePlayerSearchPipe,
    HeightPipe,
  ],
  providers: [],
})
export class PipesModule {}
