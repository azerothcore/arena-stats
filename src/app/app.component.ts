import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { SERVER_NAME } from "config";
import { AppService } from "./app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected service: AppService = inject(AppService);
  protected readonly serverName = SERVER_NAME;
}
