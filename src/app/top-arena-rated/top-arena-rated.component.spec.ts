import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopArenaRatedComponent } from './top-arena-rated.component';

describe('TopArenaRatedComponent', () => {
  let component: TopArenaRatedComponent;
  let fixture: ComponentFixture<TopArenaRatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopArenaRatedComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TopArenaRatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
