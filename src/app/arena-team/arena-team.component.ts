import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ArenaTeamService } from "./arena-team.service";

@Component({
  selector: "app-arena-team",
  templateUrl: "./arena-team.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArenaTeamComponent {
  protected readonly service: ArenaTeamService = inject(ArenaTeamService);
}
