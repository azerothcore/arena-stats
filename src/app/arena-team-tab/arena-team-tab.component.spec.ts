import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ArenaTeamService } from "../arena-team/arena-team.service";
import { ArenaTeamTabComponent } from "./arena-team-tab.component";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("ArenaTeamTabComponent", () => {
  let component: ArenaTeamTabComponent;
  let fixture: ComponentFixture<ArenaTeamTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ArenaTeamTabComponent],
    providers: [ArenaTeamService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

    fixture = TestBed.createComponent(ArenaTeamTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
