import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from './core/components/map/map.component';
import { HeaderComponent } from './core/components/header/header.component';

export type MockedMeasuresType = {
  id: number;
  coordinates: number[];
  dataType: string;
  measuredAt: string;
  connection: "good" | "regular" | "bad"
}

const mockedMeasures: MockedMeasuresType[] = [
  {
    id: 1,
    coordinates: [-43.8912, -20.4969],
    dataType: "RSSI",
    measuredAt: '2022-10-05T00:00:00.000Z',
    connection: 'good'
  },
  {
    id: 2,
    coordinates: [-43.8869, -20.5027],
    dataType: "Custo",
    measuredAt: '2023-10-05T00:00:00.000Z',
    connection: "regular"
  },
  {
    id: 3,
    coordinates: [-43.8999, -20.5020],
    dataType: "RSSI",
    measuredAt: '2024-10-05T00:00:00.000Z',
    connection: "bad"
  }
];

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
    let newMeasures = [...mockedMeasures];

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
    this.measures = new Array(...mockedMeasures);
  }
}
