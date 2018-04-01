import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartComponent } from './chart.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartComponent],
      imports: [
        ChartsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.liveAnswers = {
      "A": 5,
      "B": 1,
      "E": 4
    };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get count based on the option provided', () => {
    expect(component.getCount("A")).toEqual(5);
    expect(component.getCount("B")).toEqual(1);
    expect(component.getCount("E")).toEqual(4);
    expect(component.getCount("X")).toEqual(0);
  });
});
