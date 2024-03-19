import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { TabsModule } from "ngx-bootstrap/tabs";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ArenaTeamMemberComponent } from "./arena-team-member/arena-team-member.component";
import { ArenaTeamComponent } from "./arena-team/arena-team.component";

@NgModule({
  declarations: [AppComponent, ArenaTeamComponent, ArenaTeamMemberComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TabsModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
