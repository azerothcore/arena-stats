import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ArenaTeamMemberService } from "./arena-team-member.service";

@Component({
  selector: "app-arena-team-member",
  templateUrl: "./arena-team-member.component.html",
  styleUrls: ["./arena-team-member.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArenaTeamMemberComponent implements OnInit {
  protected readonly service: ArenaTeamMemberService = inject(
    ArenaTeamMemberService
  );
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  private readonly destroy$ = new Subject();

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.service.init(params.get("id"));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
