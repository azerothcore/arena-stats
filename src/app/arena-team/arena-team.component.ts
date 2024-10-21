import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ENABLE_1v1, ENABLE_3V3_SOLO_QUEUE } from "config";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ArenaTeamTabComponent } from "../arena-team-tab/arena-team-tab.component";
import { ArenaTeamService } from "./arena-team.service";

@Component({
  selector: "app-arena-team",
  templateUrl: "./arena-team.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TabsModule, ArenaTeamTabComponent, AsyncPipe],
})
export class ArenaTeamComponent {
  protected readonly service: ArenaTeamService = inject(ArenaTeamService);
  protected readonly teams = [
    ENABLE_1v1 ? { tabName: "1v1", arenaType: 1, solo: true } : {},
    { tabName: "2v2", arenaType: 2 },
    { tabName: "3v3", arenaType: 3 },
    ENABLE_3V3_SOLO_QUEUE
      ? { tabName: "3v3soloQ", arenaType: 4, solo: true }
      : {},
    { tabName: "5v5", arenaType: 5 },
  ].filter((t) => t.hasOwnProperty("tabName"));
}
