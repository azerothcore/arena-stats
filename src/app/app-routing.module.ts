import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArenaTeamMemberComponent } from './arena-team-member/arena-team-member.component';
import { ArenaTeamComponent } from './arena-team/arena-team.component';

const routes: Routes = [
  { path: '',         component: ArenaTeamComponent       },
  { path: 'team/:id', component: ArenaTeamMemberComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
