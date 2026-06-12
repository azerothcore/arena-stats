import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamFightHistoryComponent } from './team-fight-history.component';

describe('TeamFightHistoryComponent', () => {
  let component: TeamFightHistoryComponent;
  let fixture: ComponentFixture<TeamFightHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamFightHistoryComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamFightHistoryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('teamId', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
