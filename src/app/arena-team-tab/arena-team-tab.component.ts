import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from "@angular/core";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ArenaTeamService } from "../arena-team/arena-team.service";
import { ArenaTeam } from "../types/arena-team.type";

@Component({
  selector: "app-arena-team-tab",
  standalone: true,
  imports: [TabsModule, CommonModule],
  templateUrl: "./arena-team-tab.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArenaTeamTabComponent {
  @Input() teams: ArenaTeam[];

  protected readonly service: ArenaTeamService = inject(ArenaTeamService);
}
