import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ArenaTeamService } from "../arena-team/arena-team.service";
import { ArenaTeamTabComponent } from "./arena-team-tab.component";

describe("ArenaTeamTabComponent", () => {
  let component: ArenaTeamTabComponent;
  let fixture: ComponentFixture<ArenaTeamTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ArenaTeamTabComponent],
      providers: [ArenaTeamService],
    }).compileComponents();

    fixture = TestBed.createComponent(ArenaTeamTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
