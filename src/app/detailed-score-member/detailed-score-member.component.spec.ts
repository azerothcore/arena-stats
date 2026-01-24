import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailedScoreMemberComponent } from './detailed-score-member.component';

describe('DetailedScoreMemberComponent', () => {
  let component: DetailedScoreMemberComponent;
  let fixture: ComponentFixture<DetailedScoreMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedScoreMemberComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailedScoreMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
