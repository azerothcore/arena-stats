import { Component, OnInit } from '@angular/core';
import { ArenaTeamMemberService } from './arena-team-member.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-arena-team-member',
  templateUrl: './arena-team-member.component.html',
  styleUrls: ['./arena-team-member.component.scss']
})
export class ArenaTeamMemberComponent implements OnInit {

  constructor(public service: ArenaTeamMemberService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.service.init(params.get('id'));
    });
  }

}
