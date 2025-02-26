import { NgModule } from '@angular/core';

import { LeagueTypePipe } from '../pipes/get-league-type.pipe';
import { DraftOrderTypeTypePipe } from './get-draft-order-type.pipe';
import { PlayoffSeedingTypePipe } from './get-playoff-seeding-type.pipe';
import { PlayoffTieBreakerTypePipe } from './get-playoff-tie-breaker-type.pipe';
import { TransferPortalDeadlineTypePipe } from './get-transfer-portal-deadline-type-pipe.pipe';
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
  ],
  declarations: [
    LeagueTypePipe,
    DraftOrderTypeTypePipe,
    PlayoffSeedingTypePipe,
    PlayoffTieBreakerTypePipe,
    TransferPortalDeadlineTypePipe,
    TeamNamePipe,
  ],
  providers: [],
})
export class PipesModule {}
