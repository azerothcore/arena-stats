import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArenaTeamMemberService } from '../arena-team-member/arena-team-member.service';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.scss'],
  imports: [],
})
export class FightComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly arenaTeamMemberService = inject(ArenaTeamMemberService);

  protected fightId: string | null = null;

  ngOnInit(): void {
    this.fightId = this.route.snapshot.paramMap.get('id');
  }
}
