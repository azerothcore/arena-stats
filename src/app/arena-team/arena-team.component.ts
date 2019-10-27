import { Component, OnInit } from '@angular/core';
import { ArenaTeamService } from './arena-team.service';

@Component({
  selector: 'app-arena-team',
  templateUrl: './arena-team.component.html',
  styleUrls: ['./arena-team.component.scss']
})
export class ArenaTeamComponent {
  constructor(public service: ArenaTeamService) { }
}
