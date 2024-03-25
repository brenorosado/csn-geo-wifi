import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from './core/components/map/map.component';
import { HeaderComponent } from './core/components/header/header.component';
import { MockedMeasuresType, generateMockedMeasures } from './core/utils/generateMockedMeasures';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MapComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'QGisProject';
  formValues = {
    startAt: null,
    endAt: null,
    dataType: null,
    precision: 0.001
  }
  measures: MockedMeasuresType[] = [];

  constructor(public cdr: ChangeDetectorRef) {}

  onSubmitForm = (data: any) => {
    let newMeasures = [...this.measures];

    if (data?.startAt)
      newMeasures = new Array(
        ...newMeasures.filter(
          ({ measuredAt }) => 
            Number(new Date(measuredAt)) >= 
            Number(new Date(data.startAt))
        )
      );

    if (data?.endAt)
      newMeasures = new Array(
        ...newMeasures.filter(
          ({ measuredAt }) =>
            Number(new Date(measuredAt)) <=
            Number(new Date(data.endAt))
        )
      );

    this.formValues = {...data};
    this.measures = new Array(...newMeasures);
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.measures = generateMockedMeasures({});
  }
}
