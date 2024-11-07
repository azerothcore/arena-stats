import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArenaPlayerComponent } from './arena-player/arena-player.component';
import { ArenaTeamMemberComponent } from './arena-team-member/arena-team-member.component';
import { ArenaTeamComponent } from './arena-team/arena-team.component';

const routes: Routes = [
  { path: '', component: ArenaTeamComponent },
  { path: 'team/:id', component: ArenaTeamMemberComponent },
  { path: 'player/:guid', component: ArenaPlayerComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
