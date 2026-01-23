import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailedScoreComponent } from './detailed-score.component';

describe('DetailedScoreComponent', () => {
  let component: DetailedScoreComponent;
  let fixture: ComponentFixture<DetailedScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedScoreComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailedScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
